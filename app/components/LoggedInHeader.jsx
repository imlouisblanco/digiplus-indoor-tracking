'use client'
import Image from "next/image";
import { Sidebar } from "@/app/components/Sidebar";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    EnvelopeIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export const LoggedInHeader = ({ session }) => {
    const [userMenu, setUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const sidebarElements = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                >
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
            ),
            href: "",
            text: "Inicio",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                </svg>

            ),
            href: "devices",
            text: "Dispositivos",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>

            ),
            href: "my-user",
            text: "Mi Usuario",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('header')) {
                setShowMobileMenu(false);
                setUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const getFirstLetter = (name) => {
        const splitted = name.split(' ')
        if (splitted.length === 1) {
            return `${splitted[0][0]}${splitted[0][0]}`
        }

        return `${splitted[0][0]}${splitted[1][0]}`
    }

    return (
        <header className="flex flex-col bg-gradient-to-r from-white via-emerald-50/30 to-white border-b-2 border-emerald-100 w-full fixed z-[1010] shadow-lg">
            <nav className="w-full z-[1010] backdrop-blur-sm bg-white">
                <div className="md:w-9/10 flex flex-wrap items-center justify-between mx-0 md:mx-auto px-4 py-3">
                    {/* Logo */}
                    <div className="flex flex-row items-center">
                        <Image
                            title="Digi Plus"
                            src={'/Logo DIGI Plus Icono.png'}
                            width={120}
                            height={80}
                            className="px-4 object-cover w-auto max-w-[100px] md:max-w-[110px] transition-transform hover:scale-105"
                            alt="Digi Plus"
                        />
                    </div>

                    {/* Usuario y menú móvil */}
                    <div className="flex flex-row items-center gap-3">
                        {/* Avatar del usuario */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenu(!userMenu)}
                                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#29f57e] hover:via-emerald-500 hover:to-teal-600 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29f57e] via-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold uppercase shadow-md group-hover:shadow-lg group-hover:shadow-emerald-200 transition-all">
                                    {getFirstLetter(session.name)}
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">
                                        {session.name.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500 group-hover:text-white/90 transition-colors">
                                        {session.role}
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Botón menú móvil */}
                        <div className="flex lg:hidden">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                type="button"
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-emerald-600 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                            >
                                {showMobileMenu ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú desplegable del usuario */}
                {userMenu && (
                    <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 overflow-hidden z-[1020] animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Header del menú */}
                        <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold uppercase text-lg shadow-lg">
                                    {getFirstLetter(session.name)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">Perfil de Usuario</p>
                                    <p className="text-xs text-white/90">{session.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información del usuario */}
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                                <UserCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{session.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                                <EnvelopeIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{session.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botón de cerrar sesión */}
                        <div className="p-4 border-t border-gray-100">
                            <button
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                onClick={() => signOut()}
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Sidebar desktop */}
            <div className="hidden lg:flex">
                <Sidebar
                    isVisible={true}
                    role={session.role}
                    sidebarElements={sidebarElements}
                    session={session}
                />
            </div>

            {/* Menú móvil */}
            {showMobileMenu && (
                <div className="lg:hidden bg-white border-t-2 border-emerald-100 shadow-2xl animate-in slide-in-from-top duration-200">
                    <div className="p-4">
                        <div className="flex flex-col gap-2">
                            {/* Título */}
                            <div className="px-3 mb-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navegación</p>
                            </div>

                            {/* Links principales */}
                            {sidebarElements.map((element, index) => (
                                <Link
                                    href={`/private/${element.href}`}
                                    key={`mobile-sidebar-element-${index}`}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-all">
                                        {element.icon}
                                    </div>
                                    <span className="text-sm font-semibold">{element.text}</span>
                                </Link>
                            ))}

                            {/* Divisor y usuarios (solo admin) */}
                            {(session.roleId === 1 || session.roleId === 4) && (
                                <>
                                    <div className="my-2 px-3">
                                        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Administración</p>
                                    </div>

                                    <Link
                                        href="/private/users"
                                        onClick={() => setShowMobileMenu(false)}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold">Usuarios</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
