'use client'
import { useState } from 'react'
import { updatePassword } from '@/app/actions/users'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function EditMyUser({ user }) {
    const [newPassword, setNewPassword] = useState('')
    const [editPassword, setEditPassword] = useState(false)
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updatePassword(user.id, newPassword)
        if (response) {
            toast.success('Contraseña actualizada correctamente')
            setEditPassword(false)
            router.refresh()
        } else {
            toast.error('Error al actualizar la contraseña')
        }
    }

    return (
        <div className='flex flex-col gap-2 p-4 border-2 border-gray-300 rounded-md'>
            {editPassword ? <div>
                <div className='flex flex-row gap-2 justify-between'>
                    <h2 className='text-lg font-bold'>Cambiar contraseña</h2>
                    <button onClick={() => setEditPassword(false)} className='bg-red-500 text-white px-2 py-1 rounded-md'>Cancelar</button>
                </div>
                <form className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='newPassword'>Nueva contraseña</label>
                        <input className='border-2 border-gray-300 rounded-md p-2' type="password" placeholder='Nueva contraseña' defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='confirmNewPassword'>Confirmar contraseña</label>
                        <input className='border-2 border-gray-300 rounded-md p-2' type="password" placeholder='Confirmar contraseña' defaultValue={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSubmit} disabled={!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword} className='bg-blue-500 disabled:bg-gray-500 text-white px-2 py-1 rounded-md' type='submit'>Cambiar contraseña</button>
                </form>
            </div> : <div className='flex flex-row gap-2'>
                <input type='checkbox' id='editPassword' name='editPassword' onChange={(e) => setEditPassword(e.target.checked)} />
                <label htmlFor='editPassword'>Cambiar contraseña</label>
            </div>}
        </div>
    )
}