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

const rssiToDistance = (rssi, p0 = -59, n = 3) => {
  return Math.pow(10, (p0 - rssi) / (10 * n));
}

// Convert lat/lon to meters relative to a reference point
const latLonToXY = (lat, lon, refLat, refLon) => {
  const R = 6371000; // Earth radius in meters
  const x = (lon - refLon) * Math.cos((lat + refLat) / 2 * Math.PI / 180) * R * Math.PI / 180;
  const y = (lat - refLat) * R * Math.PI / 180;
  return { x, y };
}

// Trilateration with 3 circles in 2D
const trilaterate = (p1, r1, p2, r2, p3, r3) => {
  const A = 2 * (p2.x - p1.x);
  const B = 2 * (p2.y - p1.y);
  const C = r1 ** 2 - r2 ** 2 - p1.x ** 2 + p2.x ** 2 - p1.y ** 2 + p2.y ** 2;
  const D = 2 * (p3.x - p2.x);
  const E = 2 * (p3.y - p2.y);
  const F = r2 ** 2 - r3 ** 2 - p2.x ** 2 + p3.x ** 2 - p2.y ** 2 + p3.y ** 2;

  const x = (C * E - F * B) / (A * E - B * D);
  const y = (C * D - A * F) / (B * D - A * E);
  return { x, y };
}

// Main
const estimatePosition = (beacons, rssiData) => {
  const macs = rssiData.map(r => r.mac.toUpperCase());
  const selected = beacons.filter(b => macs.includes(b.mac));
  if (selected.length !== 3) return { lat: null, lon: null };

  const ref = selected[0].position;
  const MAX_DIST = 6;

  const positionsXY = selected.map((b) => {
    const rssi = rssiData.find(r => r.mac.toUpperCase() === b.mac).rssi;
    const rssiCleaned = parseInt(rssi.replace("dBm", ""), 10);
    const dist = Math.min(rssiToDistance(rssiCleaned), MAX_DIST);
    const { x, y } = latLonToXY(b.position[0], b.position[1], ref[0], ref[1]);
    return { x, y, r: dist };
  });

  const [p1, p2, p3] = positionsXY;
  const resultXY = trilaterate(p1, p1.r, p2, p2.r, p3, p3.r);

  if (!isFinite(resultXY.x) || !isFinite(resultXY.y)) {
    return { lat: null, lon: null };
  }

  const lat = ref[0] + (resultXY.y / 6371000) * (180 / Math.PI);
  const lon = ref[1] + (resultXY.x / (6371000 * Math.cos(ref[0] * Math.PI / 180))) * (180 / Math.PI);

  return { lat, lon };
}
