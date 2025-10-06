import { getDeviceData } from "@/app/actions/data";
import { ALLOWED_DEVICES } from "@/utils/CONFIG";
import DeviceDetails from "./DeviceDetails";

const DEFAULT_LIMIT = 1000;

export default async function DevicePage({ params }) {
  const { id } = await params;
  if (!ALLOWED_DEVICES.includes(id)) {
    return <div>Device not found</div>;
  }

  const data = await getDeviceData({ deviceId: id, limit: DEFAULT_LIMIT });

  if (!data || data.length === 0) {
    return <div>Device not found or no data</div>;
  }

  return <DeviceDetails id={id} data={data} />;
}
