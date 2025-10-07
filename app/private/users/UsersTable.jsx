'use client'
import DeleteUser from "./DeleteUser";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    CalendarIcon,
    UserCircleIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    EyeIcon,
    HashtagIcon
} from '@heroicons/react/24/outline';

export default function UsersTable({ users }) {
    const getRoleBadgeColor = (roleText) => {
        const roleLower = roleText?.toLowerCase() || '';
        if (roleLower.includes('admin')) return 'destructive';
        if (roleLower.includes('supervisor')) return 'default';
        return 'secondary';
    };

    const getInitials = (name) => {
        const splitted = name?.split(' ') || [];
        if (splitted.length === 0) return '??';
        if (splitted.length === 1) {
            return `${splitted[0][0]}${splitted[0][0]}`.toUpperCase();
        }
        return `${splitted[0][0]}${splitted[1][0]}`.toUpperCase();
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <Table className="text-sm">
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <HashtagIcon className="w-4 h-4" />
                                N°
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                Fecha de Registro
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <UserCircleIcon className="w-4 h-4" />
                                Usuario
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4" />
                                Email
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="w-4 h-4" />
                                Rol
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <TableRow key={`user-${user.id}`} className="hover:bg-emerald-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {index + 1}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                        {new Date(user.created_at).toLocaleDateString("es-CL")}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29f57e] via-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {getInitials(user.name)}
                                        </div>
                                        <span className="font-semibold text-gray-900">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getRoleBadgeColor(user.users_roles[0]?.role_id?.text)}>
                                        {user.users_roles[0]?.role_id?.text || "-"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        <Link
                                            href={`/private/users/${user.id}`}
                                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            Detalles
                                        </Link>
                                        <DeleteUser userId={user.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <UserCircleIcon className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No hay usuarios registrados</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}