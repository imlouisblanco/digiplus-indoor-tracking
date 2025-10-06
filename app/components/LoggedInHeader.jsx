'use client'
import Image from "next/image";
import { Sidebar } from "@/app/components/Sidebar";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
            href: "/",
            text: "Inicio",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                </svg>

            ),
            href: "/devices",
            text: "Dispositivos",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>

            ),
            href: "/my-user",
            text: "Mi Usuario",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('header')) {
                setShowMobileMenu(false);
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
        <header className="flex flex-col bg-white border-b border-gray-200 w-full fixed z-[1010]">
            <nav className="w-full z-[1010]">
                <div className="md:w-9/10  flex flex-wrap items-center justify-between mx-0 md:mx-auto px-4 py-2">
                    <div className="flex flex-row items-center">
                        <Image title="Digi Plus" src={'/Logo DIGI Plus Icono.png'} width={120} height={80} className="px-4 object-cover w-auto max-w-[100px] md:max-w-[110px]" alt="Digi Plus" />
                    </div>
                    <div className="flex flex-row items-center justify-between w-fit">
                        <div className="flex flex-row items-center justify-center">
                            <span onClick={() => setUserMenu(!userMenu)} className="text-white aspect-square w-10 h-10 text-center shadow-sm rounded-full bg-black uppercase text-md px-2 py-2 font-normal">{getFirstLetter(session.name)}</span>
                        </div>
                        <div className="flex md:hidden flex-row gap-2 ml-2">
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg 2xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {userMenu && <div className="flex min-w-[14rem] text-black flex-col gap-4 bg-white p-4 r-auto l-0 w-auto absolute top-20 right-1 shadow-md rounded-lg">
                    <p className="text-xs">Nombre: <span className="font-bold">{session.name}</span></p>
                    <p className="text-xs">Usuario: <span className="font-bold">{session.email}</span></p>

                    <button className="bg-black text-white font-semibold w-full px-4 py-2 text-xs" onClick={() => signOut()}>Cerrar sesión</button>
                </div>}

            </nav>
            <div className="hidden lg:flex">
                <Sidebar
                    isVisible={true}
                    role={session.role}
                    sidebarElements={sidebarElements}
                    session={session}
                />
            </div>
            {showMobileMenu && <div className="relative left-0 p-4 w-full h-full bg-white z-[50] border-[1px] border-b-gray-300 shadow-xl">
                <div className="flex flex-col gap-4">
                    {sidebarElements.map((element, index) => (
                        <Link href={`/private/${element.href}`} key={`sidebar-element-${index}`} className="flex items-center justify-start flex-row gap-2 py-2 px-4 w-full rounded-lg text-[#1C4167] group">
                            {element.icon}
                            <p>{element.text}</p>
                        </Link>
                    ))}
                    {
                        session.roleId === 1 || session.roleId === 4 && (
                            <Link href="/private/users" className="flex items-center justify-start flex-row gap-2 py-2 px-4 w-full rounded-lg text-[#1C4167] hover:bg-white/10 hover:text-primaryColor group">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                </svg>
                                <p>Usuarios</p>
                            </Link>
                        )
                    }

                </div>
            </div>}
        </header>
    )
}
