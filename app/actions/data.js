"use server";
import { supabase } from "@/lib/supabase";

export const insertData = async data => {
  console.log("Inserting data");
  const { error } = await supabase.from("data").insert({
    values: data
  });
  if (error) {
    console.log(error.message);
  }

  console.log("Data inserted successfully");
};
