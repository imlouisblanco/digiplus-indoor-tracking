"use server";
import { supabase } from "@/lib/supabase";

const convertBatteryLevel = (battery) => {
  return battery.split("%")[0];
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
    pos_data: posData
  });

  if (error) {
    console.log(error.message);
  }

  console.log("Data inserted successfully");
}
