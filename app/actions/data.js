"use server";
import { supabase } from "@/lib/supabase";

const beacons = [
  {
      mac: 'CCF45385A7B0', //living
      position: [-33.49544715319327, -70.59629772711362],
      color: 'green'
  },
  {
      mac: 'DDE5244E8AE6',
      position: [-33.4953789315699, -70.59624274183159], //pieza 4
      color: 'red'
  },
  {
      mac: 'C2DC369076CB',
      position: [-33.495380609151454, -70.59621323753392], //pieza 3
      color: 'cyan'
  },
  {
      mac: 'F3FBDA3F772E',
      position: [-33.495350412678626, -70.59614953507302], //pieza 2
      color: 'blue'
  },
  {
      mac: 'CAFCC1497F84',
      position: [-33.49542758142158, -70.59611131359648], //pieza 1
      color: 'yellow'
  },
  {
      mac: 'EF62AC568B6E',
      position: [-33.495452745127224, -70.59619982648951], //cocina
      color: 'purple'
  }
]

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