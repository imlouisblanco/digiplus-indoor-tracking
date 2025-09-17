import { AddUserForm } from "@/components/AddUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <section className="py-8">
      <div className="p-8 bg-white">
        <p className="text-3xl font-bold py-8">Crear Usuario</p>
        <AddUserForm session={session?.user} />
      </div>
    </section>
  );
};

export default Page;
