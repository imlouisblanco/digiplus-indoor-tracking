import Dashboard from "./Dashboard";
import { getDevicesLatestData } from "@/app/actions/data";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const latestData = await getDevicesLatestData();
  return <Dashboard latestData={latestData} />;
}
