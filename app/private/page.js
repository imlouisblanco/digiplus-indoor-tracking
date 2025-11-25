import Dashboard from "./Dashboard";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  return <Dashboard />;
}
