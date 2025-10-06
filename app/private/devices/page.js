import { getDevicesLatestData } from "@/app/actions/data";
import { ALLOWED_DEVICES } from "@/utils/CONFIG";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DeviceCard = ({ deviceId, data }) => {
  return (
    <div className={`flex flex-col gap-2 p-4 ${data ? "bg-white" : "bg-gray-100"} shadow-md rounded-lg`}>
      <p className="font-bold text-lg">
        {deviceId}
      </p>
      <p className="text-sm">
        Device EUID: {data?.device_euid ? data.device_euid : "No data"}
      </p>
      <p className="text-sm">
        Closest Beacon: {data?.closest_beacon ? data.closest_beacon : "No data"}
      </p>
      <p className="text-sm">
        Closest Beacon RSSI: {data?.pos_data?.rssi || "No data"}
      </p>
      <p className="text-sm">
        Battery: {data?.battery ? `${data.battery}%` : "No data"}
      </p>
      <p className="text-sm">
        Updated at: {data?.created_at ? new Date(data.created_at).toLocaleString('es-CL') : "No data"}
      </p>
      {data && <Link className="ml-auto mr-0" href={`/private/devices/${deviceId}`}>
        <Button className="bg-blue-500 text-white px-6 py-1 rounded-md hover:bg-blue-600">
          View
        </Button>
      </Link>}
    </div>
  );
};

export default async function DevicesPage() {
  const latestData = await getDevicesLatestData();
  const devicesWithData = ALLOWED_DEVICES.filter(device => latestData.find(d => d.device_id === device)).sort((a, b) => a.battery - b.battery);
  const devicesWithoutData = ALLOWED_DEVICES.filter(device => !devicesWithData.includes(device));
  
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Devices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {devicesWithData.map((device,index) =>
          <DeviceCard
            key={`device-${index}`}
            deviceId={device}
            data={latestData.find(d => d.device_id === device) || null}
          />
        )}
        {devicesWithoutData.map((device,index) =>
          <DeviceCard
            key={`device-${index}`}
            deviceId={device}
            data={null}
          />
        )}
      </div>
    </div>
  );
}
