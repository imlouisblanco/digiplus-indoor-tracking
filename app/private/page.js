import Dashboard from "./Dashboard";
import { getDevicesLatestData } from "@/app/actions/data";

export default async function Home() {
  const latestData = await getDevicesLatestData();
  return <Dashboard latestData={latestData} />;
}
