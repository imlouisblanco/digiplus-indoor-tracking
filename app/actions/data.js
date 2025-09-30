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
    pos_data: getClosestBeacon(posData)
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