import { LoggedInHeader } from "@/app/components/LoggedInHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <main className={`bg-gradient-to-r from-[#F8FAFC] to-[#e0e4e9]`}>
      <LoggedInHeader session={session.user} />
      <section
        className={`py-28 px-8 md:px-16 lg:ml-48 min-h-screen max-w-[1920px]`}
      >
        {children}
      </section>
    </main>
  );
}
