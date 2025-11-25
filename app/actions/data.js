"use server";
import { supabase } from "@/lib/supabase";
import { beacons } from "@/lib/beacons";

function getBeaconByMac(mac) {
  return beacons.find(b => b.mac.toUpperCase() === mac.toUpperCase());
}

function trilaterate(posData) {
  // Parsear las lecturas
  const readings = posData
    .map(r => {
      const beacon = getBeaconByMac(r.mac);
      if (!beacon) return null;

      const rssi = parseInt(r.rssi.replace("dBm", ""), 10);
      const d = rssiToDistance(rssi);

      return { x: beacon.x, y: beacon.y, d };
    })
    .filter(Boolean);

  if (readings.length < 3) return null;

  // Ordenar por menor distancia = mejor señal
  readings.sort((a, b) => a.d - b.d);
  const used = readings.slice(0, Math.min(5, readings.length));

  // Tomar el primero como referencia
  const ref = used[0];

  // Construir A^T A y A^T b
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

  // Resolver 2x2
  const det = A11 * A22 - A12 * A12;
  if (Math.abs(det) < 1e-6) return null;

  const invA11 =  A22 / det;
  const invA12 = -A12 / det;
  const invA22 =  A11 / det;

  const x = invA11 * B1 + invA12 * B2;
  const y = invA12 * B1 + invA22 * B2;

  return { x, y };
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
  });

  if (error) {
    console.log(error.message);
  }

  console.log("Data inserted successfully");
}

const addDevicePositionFromBeacon = (data) => {
  const beacon = beacons.find(beacon => beacon.mac.toLowerCase() === data.pos_data?.mac.toLowerCase());

  if (beacon) {
    data.position = beacon.position;
    data.color = beacon.color;
    data.closest_beacon = beacon.mac;
  }
}

export const getDevicesLatestData = async () => {
  const { data, error } = await supabase
  .from("latest_data")
  .select("*")

  if (error) {
    console.log(error.message);
  }

  data.forEach(item => {
    addDevicePositionFromBeacon(item);
  });

  return data;
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
