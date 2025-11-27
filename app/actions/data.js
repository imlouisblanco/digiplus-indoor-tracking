"use server";
import { supabase } from "@/lib/supabase";
import { beacons } from "@/lib/beacons";

function getBeaconByMac(mac) {
  return beacons.find(b => b.mac.toUpperCase() === mac.toUpperCase());
}

const REAL_WIDTH  = 40;
const REAL_HEIGHT = 30;
const MIN_RSSI_FOR_TRILAT = -80;   // más débil que esto, mejor ignorarlo
const MAX_DISTANCE = 20;           // no tiene sentido distancias > tamaño del piso

function clampToFloor(pos) {
  let x = pos.x;
  let y = pos.y;

  x = Math.max(0, Math.min(REAL_WIDTH, x));
  y = Math.max(0, Math.min(REAL_HEIGHT, y));

  return { x, y };
}

function trilaterate(posData) {
  const readings = posData
    .map(r => {
      const beacon = getBeaconByMac(r.mac);
      if (!beacon) return null;

      const rssi = parseInt(r.rssi.replace("dBm", ""), 10);
      const dRaw = rssiToDistance(rssi);
      const d = Math.min(dRaw, MAX_DISTANCE); // capear distancia

      return { x: beacon.x, y: beacon.y, d, rssi };
    })
    .filter(Boolean);

  if (readings.length === 0) return null;

  // 1) Priorizar beacons con buena señal
  const strong = readings.filter(r => r.rssi >= MIN_RSSI_FOR_TRILAT);

  let used = strong.length >= 3 ? strong : readings;

  // Si seguimos con menos de 3, usar el beacon más cercano como aproximación
  if (used.length < 3) {
    const best = used.sort((a, b) => a.d - b.d)[0];
    return clampToFloor({ x: best.x, y: best.y });
  }

  // Ordenar y tomar hasta 5
  used = [...used].sort((a, b) => a.d - b.d).slice(0, 5);

  const ref = used[0];

  let A11 = 0, A12 = 0, A22 = 0;
  let B1 = 0, B2 = 0;

  for (let i = 1; i < used.length; i++) {
    const p = used[i];
    const dx = p.x - ref.x;
    const dy = p.y - ref.y;

    const rhs =
      0.5 * (
        (p.x * p.x - ref.x * ref.x) +
        (p.y * p.y - ref.y * ref.y) +
        (ref.d * ref.d - p.d * p.d)
      );

    A11 += dx * dx;
    A12 += dx * dy;
    A22 += dy * dy;

    B1 += dx * rhs;
    B2 += dy * rhs;
  }

  const det = A11 * A22 - A12 * A12;
  if (Math.abs(det) < 1e-6) {
    // geometría mala (casi colineal, distancias raras, etc.)
    const best = used[0];
    return clampToFloor({ x: best.x, y: best.y });
  }

  const invA11 =  A22 / det;
  const invA12 = -A12 / det;
  const invA22 =  A11 / det;

  let x = invA11 * B1 + invA12 * B2;
  let y = invA12 * B1 + invA22 * B2;

  return clampToFloor({ x, y });
}


const convertBatteryLevel = (battery) => {
  return battery.split("%")[0];
}

function rssiToDistance(rssi, rssiAt1m = -59, n = 2.8) {
  const exponent = (rssiAt1m - rssi) / (10 * n);
  return Math.pow(10, exponent);  // metros
}

export const insertData = async (deviceId, data) => {
  console.log("Inserting data");
  console.log(data);
  const deviceEuid = data?.end_device_ids?.dev_eui;
  const battery = data?.uplink_message?.decoded_payload?.batt_level || null;
  const posData = data?.uplink_message?.decoded_payload?.pos_data || null;

  if (!posData || !deviceEuid) {
    console.log("No pos data or device euid");
    return;
  }

  const { error } = await supabase.from("data").insert({
    device_id: deviceId,
    device_euid: deviceEuid,
    battery: battery ? parseInt(convertBatteryLevel(battery)) : null,
    pos_data: trilaterate(posData),
    values: posData
  });

  if (error) {
    console.log(error.message);
  }

  console.log("Data inserted successfully");
}

export const getDeviceData = async ({
  deviceId = null,
  limit = 100,
}) => {
  const { data, error } = await supabase
    .from("data")
    .select("*")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data;
}

export const getDeviceDataByDate = async ({
  deviceId = null,
  startDate = null,
  endDate = null,
}) => {
  const { data, error } = await supabase
  .rpc('get_data_by_device_and_date', {
    p_device_id: deviceId,
    p_start_date: startDate,
    p_end_date: endDate
  });

  if (error) {
    console.log(error.message);
  }

  return data;
}
