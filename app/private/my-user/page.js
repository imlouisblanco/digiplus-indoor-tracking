import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserData } from '@/app/actions/users'
import EditMyUser from './EditMyUser'
const Page = async () => {
    const session = await getServerSession(authOptions)
    const user = await getUserData(session?.user.id)

    if (!user) {
        return <div>No se encontró el usuario</div>
    }

    return (
        <div className='flex flex-col gap-4 bg-white p-4 rounded-md'>
            <h1 className='text-2xl font-bold'>Mi Usuario</h1>
            <p><span className='font-bold'>Nombre:</span> {user.name}</p>
            <p><span className='font-bold'>Email:</span> {user.email}</p>
            <p><span className='font-bold'>Rol:</span> {user.users_roles[0].role_id.text}</p>
            
            <EditMyUser user={user} />
        </div>
    )
}

export default Page