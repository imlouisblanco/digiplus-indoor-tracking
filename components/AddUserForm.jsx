'use client'
import { useState, useEffect, useCallback } from "react"
import { createUser, checkEmailExists } from "@/app/actions/users"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    EyeIcon,
    EyeSlashIcon,
    UserCircleIcon,
    EnvelopeIcon,
    KeyIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { debounce } from 'lodash'

// Expresiones regulares para validaciones
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    symbol: /[^A-Za-z0-9]/
}

export const AddUserForm = ({ session }) => {
    const router = useRouter()
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: session?.roleId === 1 ? 1 : 4,
    })
    const [errors, setErrors] = useState({
        email: '',
        duplicateEmail: ''
    })
    const [emailExists, setEmailExists] = useState(false)

    // Validaciones en tiempo real
    const passwordValidations = {
        length: PASSWORD_REGEX.length.test(form.password),
        uppercase: PASSWORD_REGEX.uppercase.test(form.password),
        lowercase: PASSWORD_REGEX.lowercase.test(form.password),
        number: PASSWORD_REGEX.number.test(form.password),
        symbol: PASSWORD_REGEX.symbol.test(form.password)
    }

    // Función debounce para verificar email
    const checkEmail = useCallback(debounce(async (email) => {
        if (EMAIL_REGEX.test(email)) {
            const exists = await checkEmailExists(email)
            setEmailExists(exists)
            setErrors(prev => ({
                ...prev,
                duplicateEmail: exists ? 'Este email ya está registrado' : ''
            }))
        } else {
            setEmailExists(false)
        }
    }, 500), [])

    useEffect(() => {
        if (form.email) {
            checkEmail(form.email)
        }
        return () => checkEmail.cancel()
    }, [form.email, checkEmail])

    const isFormValid = () => {
        return (
            form.name &&
            form.email && EMAIL_REGEX.test(form.email) && !emailExists &&
            form.password && Object.values(passwordValidations).every(Boolean) &&
            form.password === form.confirmPassword &&
            form.role_id
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormValid()) return

        setIsSubmitting(true)

        try {
            const result = await createUser(form)

            if (result?.success) {
                setShowSuccessModal(true)
                setTimeout(() => router.push('/private/users'), 2000)
            }
        } catch (error) {
            console.error('Error al crear usuario:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 via-[#29f57e] to-teal-500 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    Información del Usuario
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Datos Personales</h4>

                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserCircleIcon className="w-4 h-4 text-emerald-600" />
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Ingrese el nombre completo"
                            className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
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
                            placeholder="ejemplo@correo.com"
                            className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 transition-all ${errors.email || errors.duplicateEmail
                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-200'
                                }`}
                            value={form.email}
                            onChange={(e) => {
                                const email = e.target.value
                                setForm({ ...form, email })
                                setErrors({
                                    ...errors,
                                    email: email && !EMAIL_REGEX.test(email)
                                        ? 'Por favor ingrese un email válido'
                                        : ''
                                })
                            }}
                            required
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                <XMarkIcon className="w-4 h-4" />
                                {errors.email}
                            </p>
                        )}
                        {errors.duplicateEmail && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {errors.duplicateEmail}
                            </p>
                        )}
                    </div>

                    {/* Rol */}
                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                            Rol del Usuario
                        </label>
                        <select
                            id="role"
                            className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            value={form.role_id}
                            onChange={(e) => setForm({ ...form, role_id: parseInt(e.target.value) })}
                        >
                            {session.roleId === 1 && <option value={1}>SuperAdministrador</option>}
                            <option value={2}>Operador</option>
                            <option value={4}>Administrador</option>
                        </select>
                    </div>
                </div>

                {/* Sección de seguridad */}
                <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Seguridad</h4>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4 text-emerald-600" />
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingrese la contraseña"
                                className="w-full border-2 border-gray-200 focus:border-emerald-400 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
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

                    {/* Confirmar Contraseña */}
                    <div className="space-y-2 mt-4">
                        <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirme la contraseña"
                            className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 transition-all ${form.confirmPassword && !passwordsMatch
                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-200'
                                }`}
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                        {form.confirmPassword && !passwordsMatch && (
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

                    {/* Requisitos de contraseña */}
                    <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Requisitos de la contraseña:</p>
                        <div className="space-y-1 text-sm">
                            <p className={`flex items-center gap-2 ${form.password
                                    ? (passwordValidations.length ? 'text-emerald-600' : 'text-red-500')
                                    : 'text-gray-600'
                                }`}>
                                {form.password
                                    ? (passwordValidations.length ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />)
                                    : <span className="w-4 h-4 flex items-center justify-center">•</span>
                                }
                                Mínimo 8 caracteres
                            </p>
                            <p className={`flex items-center gap-2 ${form.password
                                    ? (passwordValidations.uppercase ? 'text-emerald-600' : 'text-red-500')
                                    : 'text-gray-600'
                                }`}>
                                {form.password
                                    ? (passwordValidations.uppercase ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />)
                                    : <span className="w-4 h-4 flex items-center justify-center">•</span>
                                }
                                Al menos 1 letra mayúscula
                            </p>
                            <p className={`flex items-center gap-2 ${form.password
                                    ? (passwordValidations.lowercase ? 'text-emerald-600' : 'text-red-500')
                                    : 'text-gray-600'
                                }`}>
                                {form.password
                                    ? (passwordValidations.lowercase ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />)
                                    : <span className="w-4 h-4 flex items-center justify-center">•</span>
                                }
                                Al menos 1 letra minúscula
                            </p>
                            <p className={`flex items-center gap-2 ${form.password
                                    ? (passwordValidations.number ? 'text-emerald-600' : 'text-red-500')
                                    : 'text-gray-600'
                                }`}>
                                {form.password
                                    ? (passwordValidations.number ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />)
                                    : <span className="w-4 h-4 flex items-center justify-center">•</span>
                                }
                                Al menos 1 número
                            </p>
                            <p className={`flex items-center gap-2 ${form.password
                                    ? (passwordValidations.symbol ? 'text-emerald-600' : 'text-red-500')
                                    : 'text-gray-600'
                                }`}>
                                {form.password
                                    ? (passwordValidations.symbol ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />)
                                    : <span className="w-4 h-4 flex items-center justify-center">•</span>
                                }
                                Al menos 1 símbolo especial
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        className="flex-1 bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:shadow-none transition-all duration-300"
                    >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Creando Usuario...' : 'Crear Usuario'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push('/private/users')}
                        variant="outline"
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    >
                        <XMarkIcon className="w-5 h-5 mr-2" />
                        Cancelar
                    </Button>
                </div>
            </form>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md animate-in zoom-in duration-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#29f57e] to-emerald-500 flex items-center justify-center">
                                <CheckCircleIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">¡Usuario Creado!</h3>
                            <p className="text-gray-600 text-center">El usuario se ha registrado correctamente en el sistema</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}