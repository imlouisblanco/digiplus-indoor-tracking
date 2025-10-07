import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserData } from '@/app/actions/users'
import EditMyUser from './EditMyUser'
import { 
    UserCircleIcon, 
    EnvelopeIcon, 
    ShieldCheckIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline'

const Page = async () => {
    const session = await getServerSession(authOptions)
    const user = await getUserData(session?.user.id)

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <UserCircleIcon className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-lg font-semibold text-gray-600">No se encontró el usuario</p>
            </div>
        )
    }

    // Obtener iniciales del nombre
    const getInitials = (name) => {
        const splitted = name.split(' ')
        if (splitted.length === 1) {
            return `${splitted[0][0]}${splitted[0][0]}`
        }
        return `${splitted[0][0]}${splitted[1][0]}`
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <IdentificationIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                        Mi Perfil
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Información personal y configuración</p>
                </div>
            </div>

            {/* Contenedor principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card de avatar y nombre */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-8 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl uppercase shadow-2xl mb-4">
                            {getInitials(user.name)}
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">
                            {user.name}
                        </h2>
                        <p className="text-sm text-white/90 mt-2">{user.users_roles[0].role_id.text}</p>
                    </div>
                    
                    
                </div>

                {/* Card de información */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información personal */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <UserCircleIcon className="w-5 h-5" />
                                Información Personal
                            </h3>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {/* Nombre completo */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <UserCircleIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{user.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1 break-all">{user.email}</p>
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rol del Usuario</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{user.users_roles[0].role_id.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seguridad */}
                    <EditMyUser user={user} />
                </div>
            </div>
        </div>
    )
}

export default Page