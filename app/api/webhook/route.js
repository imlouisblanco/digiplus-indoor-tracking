// Archivo: app/api/webhook-data/route.js
import { NextResponse } from "next/server";
import { insertData } from "@/app/actions/data";

export async function POST(req) {
  const ttnData = await req.json();
  const deviceId = ttnData?.end_device_ids?.device_id;

  if (!deviceId) {
    return NextResponse.json({ message: "OK: No device ID found" }, { status: 200 });
  }
  
  const ignoredDeviceIds = ['mcldev001', 'mklw006','mklw001','mklw002','mklw003','mklw004']; 

  if (ignoredDeviceIds.includes(deviceId)) {
    console.log(`Webhook ignorado para el dispositivo de prueba: ${deviceId}`);
    return NextResponse.json({ message: `OK: Test device ${deviceId} ignored` }, { status: 200 });
  }

  try {
    console.log(`Procesando mensaje del dispositivo de producción: ${deviceId}`);
    await insertData(ttnData);
    return NextResponse.json({ message: "Webhook processed for production device" }, { status: 200 });
  } catch (error) {
    console.error(`Error al insertar datos para el dispositivo ${deviceId}:`, error.message);
    return NextResponse.json({ message: "Error processing data" }, { status: 500 });
  }
}