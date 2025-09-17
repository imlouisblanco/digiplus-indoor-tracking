'use client'
import { deleteUser } from "@/app/actions/users"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DeleteUser({ userId }) {
    const router = useRouter()
    const handleDelete = async () => {
        const response = await deleteUser(userId)
        if (response) {
            toast.success('Usuario eliminado correctamente')
            router.refresh()
        } else {
            toast.error('Error al eliminar el usuario')
        }
    }
    return (
        <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={handleDelete}>
            Eliminar
        </button>
    )
}