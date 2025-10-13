"use server";
import { supabase } from "@/lib/supabase";
import { beacons } from "@/lib/beacons";

const convertBatteryLevel = (battery) => {
  return battery.split("%")[0];
}

const getClosestBeacon = (posData) => {
  let closestBeacon = null;
  let closestDistance = -10000; // -10000 is a very large distance

  posData.forEach(item => {
    let distance = parseInt(item.rssi.split("d")[0]);
    if (distance > closestDistance) {
      closestBeacon = item;
      closestDistance = distance;
    }
  });

  return closestBeacon;
}


export const insertData = async (deviceId, data) => {
  console.log("Inserting data");
  const deviceEuid = data?.end_device_ids?.dev_eui;
  const battery = data?.uplink_message?.decoded_payload?.batt_level || null;
  const posData = data?.uplink_message?.decoded_payload?.pos_data || null;

  const { error } = await supabase.from("data").insert({
    values: data,
    device_id: deviceId,
    device_euid: deviceEuid,
    battery: parseInt(convertBatteryLevel(battery)),
    pos_data: getClosestBeacon(posData),
    estimated_position: estimatePosition(beacons, posData)
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
const EARTH_RADIUS = 6371000; // m

const rssiToDistance = (rssi, p0 = -59, n = 3.2) => {
  return Math.pow(10, (p0 - rssi) / (10 * n));
};

const adjustDistance = (dist, rssi) => {
  if (rssi > -60) return dist * 0.5;
  if (rssi > -65) return dist * 0.8;
  if (rssi > -70) return dist * 1.0;
  return dist * 1.4;
};

const clampDistance = (dist, min = 0.5, max = 6) => Math.min(Math.max(dist, min), max);

const latLonToXY = (lat, lon, refLat, refLon) => {
  const x = (lon - refLon) * Math.cos((lat + refLat) / 2 * Math.PI / 180) * EARTH_RADIUS * Math.PI / 180;
  const y = (lat - refLat) * EARTH_RADIUS * Math.PI / 180;
  return { x, y };
};

const trilaterate = (p1, r1, p2, r2, p3, r3) => {
  const A = 2 * (p2.x - p1.x);
  const B = 2 * (p2.y - p1.y);
  const C = r1 ** 2 - r2 ** 2 - p1.x ** 2 + p2.x ** 2 - p1.y ** 2 + p2.y ** 2;
  const D = 2 * (p3.x - p2.x);
  const E = 2 * (p3.y - p2.y);
  const F = r2 ** 2 - r3 ** 2 - p2.x ** 2 + p3.x ** 2 - p2.y ** 2 + p3.y ** 2;

  const denominator = A * E - B * D;
  if (denominator === 0) return null;

  const x = (C * E - F * B) / denominator;
  const y = (C * D - A * F) / (B * D - A * E);
  return { x, y };
};

const estimatePosition = (beacons, rssiData) => {
  const macs = rssiData.map(r => r.mac.toUpperCase());
  const selected = beacons.filter(b => macs.includes(b.mac));
  if (selected.length !== 3) return { lat: null, lon: null };

  const ref = selected[0].position;
  let strongest = null;

  const positionsXY = selected.map((b) => {
    const rawRssi = rssiData.find(r => r.mac.toUpperCase() === b.mac).rssi;
    const rssi = parseInt(rawRssi.replace("dBm", ""), 10);
    const distRaw = rssiToDistance(rssi);
    const dist = clampDistance(adjustDistance(distRaw, rssi));

    if (!strongest || rssi > strongest.rssi) {
      strongest = { rssi, beacon: b, dist };
    }

    const { x, y } = latLonToXY(b.position[0], b.position[1], ref[0], ref[1]);
    return { x, y, r: dist, rssi, mac: b.mac };
  });

  const [p1, p2, p3] = positionsXY;
  const resultXY = trilaterate(p1, p1.r, p2, p2.r, p3, p3.r);
  if (!resultXY || !isFinite(resultXY.x) || !isFinite(resultXY.y)) {
    return { lat: null, lon: null };
  }

  // Convert back to lat/lon
  const trilatLat = ref[0] + (resultXY.y / EARTH_RADIUS) * (180 / Math.PI);
  const trilatLon = ref[1] + (resultXY.x / (EARTH_RADIUS * Math.cos(ref[0] * Math.PI / 180))) * (180 / Math.PI);

  // Si el beacon más fuerte tiene al menos 10 dBm más potencia que el segundo, "atraemos" la posición hacia él
  const sortedByRssi = positionsXY.sort((a, b) => b.rssi - a.rssi);
  const diff = sortedByRssi[0].rssi - sortedByRssi[1].rssi;

  if (diff >= 10) {
    const [bLat, bLon] = strongest.beacon.position;
    return {
      lat: bLat * 0.7 + trilatLat * 0.3,
      lon: bLon * 0.7 + trilatLon * 0.3
    };
  }

  return { lat: trilatLat, lon: trilatLon };
};