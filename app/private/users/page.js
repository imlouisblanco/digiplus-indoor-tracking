import { getUsers } from "@/app/actions/users";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UsersTable from "./UsersTable";
import { Badge } from "@/components/ui/badge";
import { 
  UsersIcon, 
  UserPlusIcon 
} from '@heroicons/react/24/outline';

const Page = async () => {
  const session = await getServerSession(authOptions);
  const users = await getUsers({
    roleId: session.user.roleId
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <UsersIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Gestión de Usuarios
            </h1>
            <p className="text-sm text-gray-500 mt-1">Administra los usuarios del sistema</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-4 py-2">
            <UsersIcon className="w-4 h-4 mr-2" />
            {users?.length || 0} usuarios
          </Badge>
          <Link
            href="/private/users/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300"
          >
            <UserPlusIcon className="w-5 h-5" />
            Crear Usuario
          </Link>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-[#29f57e] to-teal-500 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Lista de Usuarios
          </h3>
        </div>
        <div className="p-6">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  );
};

export default Page;
