import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.roleId !== 1 && session.user.roleId !== 4)) {
    return (
      <div className="py-4 lg:p-8 gap-4 flex flex-col w-full h-full">
        <div className="flex flex-col gap-4 bg-white rounded-md p-4">
          <p className="text-lg font-bold">
            No tienes permisos para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}
