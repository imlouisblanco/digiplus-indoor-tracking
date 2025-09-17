'use client'
import { useState, useEffect, useCallback } from "react"
import { createUser, checkEmailExists } from "@/app/actions/users"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
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
            (form.role_id === 1)
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

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nombre */}
                <input
                    type="text"
                    placeholder="Nombre"
                    className="px-4 py-2 bg-gray-100"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 bg-gray-100"
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
                {errors.email && <p className="text-gray-700 text-sm mt-1">{errors.email}</p>}
                {errors.duplicateEmail && <p className="text-red-500 text-sm mt-1">{errors.duplicateEmail}</p>}

                {/* Contraseña */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="px-4 py-2 bg-gray-100 w-full"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </div>
                </div>

                {/* Confirmar Contraseña */}
                <input
                    type="password"
                    placeholder="Confirmar Password"
                    className="px-4 py-2 bg-gray-100"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                />

                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                )}

                {/* Requisitos de contraseña */}
                <div className="text-sm mt-1">
                    <p className={form.password ? (passwordValidations.length ? 'text-gray-600' : 'text-red-500') : 'text-gray-600'}>
                        {form.password ? (passwordValidations.length ? '✅ ' : '❌ ') : '• '}
                        Mínimo 8 caracteres.
                    </p>
                    <p className={form.password ? (passwordValidations.uppercase ? 'text-gray-600' : 'text-red-500') : 'text-gray-600'}>
                        {form.password ? (passwordValidations.uppercase ? '✅ ' : '❌ ') : '• '}
                        Al menos 1 mayúscula.
                    </p>
                    <p className={form.password ? (passwordValidations.lowercase ? 'text-gray-600' : 'text-red-500') : 'text-gray-600'}>
                        {form.password ? (passwordValidations.lowercase ? '✅ ' : '❌ ') : '• '}
                        Al menos 1 minúscula.
                    </p>
                    <p className={form.password ? (passwordValidations.number ? 'text-gray-600' : 'text-red-500') : 'text-gray-600'}>
                        {form.password ? (passwordValidations.number ? '✅ ' : '❌ ') : '• '}
                        Al menos 1 número.
                    </p>
                    <p className={form.password ? (passwordValidations.symbol ? 'text-gray-600' : 'text-red-500') : 'text-gray-600'}>
                        {form.password ? (passwordValidations.symbol ? '✅ ' : '❌ ') : '• '}
                        Al menos 1 símbolo.
                    </p>
                </div>

                {/* Rol */}
                <select
                    className="px-4 py-2 bg-gray-100"
                    value={form.role_id}
                    onChange={(e) => setForm({ ...form, role_id: parseInt(e.target.value) })}
                >
                    {session.roleId === 1 && <option value={1}>SuperAdministrador</option>}
                    <option value={2}>Operador</option>
                    <option value={4}>Administrador</option>
                </select>

                {/* Botones */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={!isFormValid() || isSubmitting}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-800 disabled:bg-gray-500 font-bold px-4 py-2 text-white rounded-md"
                    >
                        {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/private/users')}
                        className="bg-primaryColor hover:bg-primaryColorLight text-white px-4 py-2 rounded-md"
                    >
                        Cancelar
                    </button>
                </div>
            </form>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h3 className="text-lg font-bold mb-2">¡Éxito!</h3>
                        <p>El usuario se ha registrado correctamente</p>
                    </div>
                </div>
            )}
        </div>
    )
}