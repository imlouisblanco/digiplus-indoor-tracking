import { getUsers } from "@/app/actions/users";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UsersTable from "./UsersTable";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const users = await getUsers({
    roleId: session.user.roleId
  });

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Usuarios</h1>
      <div className="p-8 bg-white">
        <div className="flex justify-end items-center">
          <Link
            href="/private/users/create"
            className="bg-primaryColor text-white px-4 py-2 text-lg rounded-md"
          >
            Crear usuario
          </Link>
        </div>
        <UsersTable users={users} />
      </div>
    </section>
  );
};

export default Page;
