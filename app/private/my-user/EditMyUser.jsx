'use client'
import { useState } from 'react'
import { updatePassword } from '@/app/actions/users'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    LockClosedIcon,
    KeyIcon,
    XMarkIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function EditMyUser({ user }) {
    const [newPassword, setNewPassword] = useState('')
    const [editPassword, setEditPassword] = useState(false)
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updatePassword(user.id, newPassword)
        if (response) {
            toast.success('Contraseña actualizada correctamente')
            setEditPassword(false)
            setNewPassword('')
            setConfirmNewPassword('')
            router.refresh()
        } else {
            toast.error('Error al actualizar la contraseña')
        }
    }

    const passwordsMatch = newPassword && confirmNewPassword && newPassword === confirmNewPassword
    const canSubmit = newPassword && confirmNewPassword && passwordsMatch

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 via-[#29f57e] to-emerald-500 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5" />
                    Seguridad
                </h3>
            </div>

            <div className="p-6">
                {editPassword ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <KeyIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h4>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditPassword(false)
                                    setNewPassword('')
                                    setConfirmNewPassword('')
                                }}
                                variant="outline"
                                size="sm"
                                className="gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                                <XMarkIcon className="w-4 h-4" />
                                Cancelar
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nueva contraseña */}
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <KeyIcon className="w-4 h-4 text-emerald-600" />
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Ingrese nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="space-y-2">
                                <label htmlFor="confirmNewPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmNewPassword"
                                        className={`w-full border-2 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 transition-all ${confirmNewPassword && !passwordsMatch
                                                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-200'
                                            }`}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirme la contraseña"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {confirmNewPassword && !passwordsMatch && (
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

                            {/* Botón de guardar */}
                            <Button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:shadow-none transition-all duration-300"
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                Actualizar Contraseña
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <LockClosedIcon className="w-5 h-5 text-emerald-600" />
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
                            >
                                <KeyIcon className="w-4 h-4 mr-2" />
                                Cambiar
                            </Button>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <LockClosedIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-semibold">Recomendación de seguridad:</p>
                                <p className="text-xs mt-1">Use una contraseña segura que combine letras mayúsculas, minúsculas, números y símbolos.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}