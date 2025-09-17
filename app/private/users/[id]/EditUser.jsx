'use client'
import { useState } from 'react'
import { updateUser } from '@/app/actions/users'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function EditUser({ user }) {
    const [editUser, setEditUser] = useState(false)
    const [currentUser, setCurrentUser] = useState(user)
    const [editPassword, setEditPassword] = useState(false)
    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updateUser(user.id, currentUser, editPassword, user.users_roles[0].role_id.id !== currentUser.role_id)
        if (response) {
            toast.success('Usuario actualizado correctamente')
            setEditUser(false)
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

    if (!editUser) {
        return (
            <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
                <div className='flex flex-row justify-between'>
                    <h1 className="text-2xl font-bold">Detalles de Usuario</h1>
                    <button onClick={() => setEditUser(!editUser)} className="bg-blue-500 text-white px-2 py-1 rounded-md">
                        Editar
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">Nombre:</span> {user.name}
                    </p>
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">Email:</span> {user.email}
                    </p>
                    <p className="text-lg text-gray-500">
                        <span className="font-bold">Rol:</span> {user.users_roles[0].role_id.text}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
            <div className='flex flex-row justify-between'>
                <h1 className="text-2xl font-bold">Detalles de Usuario</h1>
                <div className='flex flex-row gap-2'>
                    <button onClick={handleSubmit}
                        disabled={!isValidForm()}
                        className="bg-blue-500 disabled:bg-gray-500 text-white px-2 py-1 rounded-md">
                        Guardar
                    </button>
                    <button onClick={() => {
                        setEditUser(!editUser)
                        setCurrentUser(user)
                    }} className="bg-red-500 text-white px-2 py-1 rounded-md">
                        Cancelar
                    </button>
                </div>
            </div>

            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="name">Nombre</label>
                    <input className='border-2 border-gray-300 rounded-md p-2' type="text" id="name" name="name" value={currentUser.name} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="email">Email</label>
                    <input className='border-2 border-gray-300 rounded-md p-2' type="email" id="email" name="email" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="role">Rol</label>
                    <select className='border-2 border-gray-300 rounded-md p-2' defaultValue={currentUser.users_roles[0].role_id.id} id="role" name="role" onChange={(e) => setCurrentUser({ ...currentUser, role_id: parseInt(e.target.value) })}>
                        <option value={1} >SuperAdministrador</option>
                        <option value={2} >Operador</option>
                        {/* <option value={3} >Supervisor</option> */}
                        <option value={4} >Administrador</option>
                    </select>
                </div>
            </form>

            {editPassword ? <div className='flex flex-col gap-2'>
                <div className='flex flex-row gap-2'>
                    <p className='text-lg text-gray-500'>ATENCIÓN, estás editando la contraseña de este usuario</p> <button onClick={() => setEditPassword(!editPassword)} className="bg-red-500 text-white px-2 py-1 rounded-md">
                        Cancelar
                    </button>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="password">Contraseña</label>
                    <input className='border-2 border-gray-300 rounded-md p-2' type="password" id="password" name="password" defaultValue={currentUser.password} onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input className='border-2 border-gray-300 rounded-md p-2' type="password" id="confirmPassword" name="confirmPassword" defaultValue={currentUser.password} onChange={(e) => setCurrentUser({ ...currentUser, confirmPassword: e.target.value })} />
                </div>
            </div> : <div className='flex flex-row gap-2'>
                <label htmlFor="password">Editar contraseña</label>
                <input type="checkbox" id="password" name="password" onChange={(e) => setEditPassword(e.target.checked)} />
            </div>}
        </div>
    )
}