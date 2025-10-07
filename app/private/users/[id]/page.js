import { getUserData } from "@/app/actions/users";
import EditUser from "./EditUser";
import Link from "next/link";
import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUserData(id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <UserCircleIcon className="w-12 h-12 text-red-500" />
        </div>
        <p className="text-lg font-semibold text-gray-600">
          Usuario no encontrado
        </p>
        <Link
          href="/private/users"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a Usuarios
        </Link>
      </div>
    );
  }

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

      {/* Componente de edición */}
      <EditUser user={user} />
    </div>
  );
}
