"use server";
import { supabase } from "@/lib/supabase";

export const insertData = async (deviceId, data) => {
  console.log("Inserting data");
  const { error } = await supabase.from("data").insert({
    values: data,
    device_id: deviceId
  });
  if (error) {
    console.log(error.message);
  }

  console.log("Data inserted successfully");
};
