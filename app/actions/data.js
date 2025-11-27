"use server";
import { supabase } from "@/lib/supabase";
import { beacons } from "@/lib/beacons";

function getBeaconByMac(mac) {
  return beacons.find(b => b.mac.toUpperCase() === mac.toUpperCase());
}

const REAL_WIDTH  = 40; // largo en metros
const REAL_HEIGHT = 30; // ancho en metros

const MIN_RSSI_FOR_TRILAT = -80; // más débil que esto: no muy confiable para trilaterar
const MAX_DISTANCE = 40;         // no tiene sentido d > tamaño del piso aprox
const MAX_MEAN_ERROR = 5;        // metros de error promedio aceptable para trilateración

function clampToFloor(pos) {
  let x = pos.x;
  let y = pos.y;

  x = Math.max(0, Math.min(REAL_WIDTH, x));
  y = Math.max(0, Math.min(REAL_HEIGHT, y));

  return { x, y };
}

function buildReadings(posData) {
  return posData
    .map(r => {
      const beacon = getBeaconByMac(r.mac);
      if (!beacon) return null;

      const rssi = parseInt(r.rssi.replace("dBm", ""), 10);
      const dRaw = rssiToDistance(rssi);
      const d = Math.min(dRaw, MAX_DISTANCE); // capear distancia

      return {
        x: beacon.x,
        y: beacon.y,
        rssi,
        d,
      };
    })
    .filter(Boolean);
}

function centroidPosition(readings) {
  if (readings.length === 0) return null;

  let sumW = 0;
  let sumX = 0;
  let sumY = 0;

  for (const r of readings) {
    const w = 1 / (r.d * r.d + 1e-6); // los cercanos pesan más
    sumW += w;
    sumX += w * r.x;
    sumY += w * r.y;
  }

  return clampToFloor({
    x: sumX / sumW,
    y: sumY / sumW,
  });
}

function trilaterateRaw(readings) {
  if (readings.length < 3) return null;

  // ordenar por menor distancia y usar hasta 5
  const used = [...readings].sort((a, b) => a.d - b.d).slice(0, 5);
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
  if (Math.abs(det) < 1e-6) return null;

  const invA11 =  A22 / det;
  const invA12 = -A12 / det;
  const invA22 =  A11 / det;

  const x = invA11 * B1 + invA12 * B2;
  const y = invA12 * B1 + invA22 * B2;

  return { x, y, used };
}

function trilatError(pos, readings) {
  if (!pos || !readings || readings.length === 0) return Infinity;

  let sumAbs = 0;

  for (const r of readings) {
    const distModel = Math.hypot(pos.x - r.x, pos.y - r.y);
    sumAbs += Math.abs(distModel - r.d);
  }

  return sumAbs / readings.length; // error promedio en metros
}

function estimatePosition(posData) {
  const readingsAll = buildReadings(posData);
  if (readingsAll.length === 0) {
    console.log("Sin beacons válidos");
    return null;
  }

  // Centroide siempre disponible
  const centroid = centroidPosition(readingsAll);

  // Filtrar lecturas “fuertes” para trilateración
  const strong = readingsAll.filter(r => r.rssi >= MIN_RSSI_FOR_TRILAT);
  const trilatReadings = strong.length >= 3 ? strong : readingsAll;

  let trilat = null;
  let error = Infinity;

  if (trilatReadings.length >= 3) {
    const raw = trilaterateRaw(trilatReadings);
    if (raw) {
      const clamped = clampToFloor({ x: raw.x, y: raw.y });
      trilat = clamped;
      error = trilatError(clamped, trilatReadings);
    }
  }

  // Decisión: si la trilateración es razonable, úsala; si no, centroide
  if (trilat && error <= MAX_MEAN_ERROR) {
    return {
      ...trilat,
      method: "trilateration",
      error,
    };
  } else {
    return {
      ...centroid,
      method: trilat ? "centroid_fallback" : "centroid_only",
      error,
    };
  }
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
    pos_data: estimatePosition(posData),
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
