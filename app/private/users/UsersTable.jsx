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
import Link from "next/link";

export default function UsersTable({ users }) {
    return (
        <Table className="text-md">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-fit">N°</TableHead>
                    <TableHead className="w-fit">Fecha de Registro</TableHead>
                    <TableHead className="w-fit">Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users &&
                    users.map((user, index) =>
                        <TableRow key={`user-${user.id}`}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {new Date(user.created_at).toLocaleDateString("es-CL")}
                            </TableCell>
                            <TableCell>
                                {user.name}
                            </TableCell>
                            <TableCell>
                                {user.email}
                            </TableCell>
                            <TableCell>
                                {user.users_roles[0]?.role_id?.text || "-"}
                            </TableCell>

                            <TableCell className="flex gap-2">
                                <Link
                                    href={`/private/users/${user.id}`}
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                >
                                    Detalles
                                </Link>
                                <DeleteUser userId={user.id} />
                            </TableCell>
                        </TableRow>
                    )}
            </TableBody>
        </Table>
    )
}