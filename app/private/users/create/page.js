import { AddUserForm } from "@/components/AddUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";

const Page = async () => {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
      {/* Botón volver */}
      <Link
        href="/private/users"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold transition-colors w-fit group"
      >
        <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 group-hover:border-emerald-300 flex items-center justify-center transition-all group-hover:bg-emerald-50">
          <ArrowLeftIcon className="w-5 h-5" />
        </div>
        Volver a Usuarios
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <UserPlusIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Crear Nuevo Usuario
          </h1>
          <p className="text-sm text-gray-500 mt-1">Registra un nuevo usuario en el sistema</p>
        </div>
      </div>

      {/* Formulario */}
      <AddUserForm session={session?.user} />
    </div>
  );
};

export default Page;
