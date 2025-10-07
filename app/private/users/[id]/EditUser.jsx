'use client'
import { useState } from 'react'
import { updateUser } from '@/app/actions/users'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    UserCircleIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    PencilIcon,
    CheckCircleIcon,
    XMarkIcon,
    KeyIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function EditUser({ user }) {
    const [editUser, setEditUser] = useState(false)
    const [currentUser, setCurrentUser] = useState(user)
    const [editPassword, setEditPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updateUser(user.id, currentUser, editPassword, user.users_roles[0].role_id.id !== currentUser.role_id)
        if (response) {
            toast.success('Usuario actualizado correctamente')
            setEditUser(false)
            setEditPassword(false)
            router.refresh()
        } else {
            toast.error('Error al actualizar el usuario')
        }
    }

    const isValidForm = () => {
        if (editPassword) {
            if (!currentUser.password || !currentUser.confirmPassword || (currentUser.password !== currentUser.confirmPassword)) {
                return false
            }
        }

        if (!currentUser.name || !currentUser.email || currentUser.name === '' || currentUser.email === '') {
            return false
        }

        return true
    }

    const getInitials = (name) => {
        const splitted = name.split(' ')
        if (splitted.length === 1) {
            return `${splitted[0][0]}${splitted[0][0]}`
        }
        return `${splitted[0][0]}${splitted[1][0]}`
    }

    const passwordsMatch = currentUser.password && currentUser.confirmPassword && currentUser.password === currentUser.confirmPassword

    if (!editUser) {
        return (
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
                        <Badge variant="secondary" className="mt-3">
                            {user.users_roles[0].role_id.text}
                        </Badge>
                    </div>

                    <div className="p-6">
                        <Button
                            onClick={() => setEditUser(true)}
                            className="w-full bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
                        >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Editar Usuario
                        </Button>
                    </div>
                </div>

                {/* Card de información */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <UserCircleIcon className="w-5 h-5" />
                            Información del Usuario
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
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 via-[#29f57e] to-teal-500 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <PencilIcon className="w-5 h-5" />
                    Editar Usuario
                </h3>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValidForm()}
                        className="bg-white text-emerald-600 hover:bg-emerald-50 disabled:bg-gray-200 disabled:text-gray-400 shadow-md transition-all"
                        size="sm"
                    >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Guardar
                    </Button>
                    <Button
                        onClick={() => {
                            setEditUser(false)
                            setCurrentUser(user)
                            setEditPassword(false)
                        }}
                        variant="outline"
                        className="bg-white text-red-600 hover:bg-red-50 border-white hover:border-red-200"
                        size="sm"
                    >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Cancelar
                    </Button>
                </div>
            </div>

            <form className="p-6 space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Información Básica</h4>

                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserCircleIcon className="w-4 h-4 text-emerald-600" />
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            value={currentUser.name}
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-emerald-600" />
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            value={currentUser.email}
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        />
                    </div>

                    {/* Rol */}
                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                            Rol
                        </label>
                        <select
                            id="role"
                            className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            defaultValue={currentUser.users_roles[0].role_id.id}
                            onChange={(e) => setCurrentUser({ ...currentUser, role_id: parseInt(e.target.value) })}
                        >
                            <option value={1}>SuperAdministrador</option>
                            <option value={2}>Operador</option>
                            <option value={4}>Administrador</option>
                        </select>
                    </div>
                </div>

                {/* Sección de contraseña */}
                <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Seguridad</h4>

                    {!editPassword ? (
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <KeyIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Contraseña</p>
                                    <p className="text-xs text-gray-500 mt-0.5">••••••••••••</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setEditPassword(true)}
                                className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
                                size="sm"
                                type="button"
                            >
                                <KeyIcon className="w-4 h-4 mr-2" />
                                Cambiar
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-semibold">Atención</p>
                                    <p className="text-xs mt-1">Estás editando la contraseña de este usuario</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setEditPassword(false)
                                        setCurrentUser({ ...currentUser, password: '', confirmPassword: '' })
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                    type="button"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Nueva contraseña */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <KeyIcon className="w-4 h-4 text-emerald-600" />
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                        value={currentUser.password || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`w-full border-2 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 transition-all ${currentUser.confirmPassword && !passwordsMatch
                                                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-200'
                                            }`}
                                        value={currentUser.confirmPassword || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, confirmPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                {currentUser.confirmPassword && !passwordsMatch && (
                                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                        <XMarkIcon className="w-4 h-4" />
                                        Las contraseñas no coinciden
                                    </p>
                                )}
                                {passwordsMatch && (
                                    <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Las contraseñas coinciden
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}