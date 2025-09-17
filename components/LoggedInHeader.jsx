'use client'
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const BHP_COMPANY_ID = '5c4ce3c5-63d4-420e-9524-bc1c3fe741b3';

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
        // {
        //   icon: (
        //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        //       <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
        //     </svg>
        //   ),
        //   href: "/alerts",
        //   text: "Alertas",
        // },
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
                    <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
            ),
            href: "/locations",
            text: "Ubicaciones",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                    <path d="m10.076 8.64-2.201-2.2V4.874a.75.75 0 0 0-.364-.643l-3.75-2.25a.75.75 0 0 0-.916.113l-.75.75a.75.75 0 0 0-.113.916l2.25 3.75a.75.75 0 0 0 .643.364h1.564l2.062 2.062 1.575-1.297Z" />
                    <path fillRule="evenodd" d="m12.556 17.329 4.183 4.182a3.375 3.375 0 0 0 4.773-4.773l-3.306-3.305a6.803 6.803 0 0 1-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 0 0-.167.063l-3.086 3.748Zm3.414-1.36a.75.75 0 0 1 1.06 0l1.875 1.876a.75.75 0 1 1-1.06 1.06L15.97 17.03a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>

            ),
            href: "/maintenance",
            text: "Mantenimiento",
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                </svg>
            ),
            href: "/configurations/alerts",
            text: "Ajustes",
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
        <header className="flex flex-col bg-transparent w-full fixed z-[1010]">
            <nav className="w-full z-[1010]">
                <div className="md:w-9/10 bg-[#F8FAFC] border-b border-gray-200 flex flex-wrap items-center justify-between mx-0 md:mx-auto px-4 py-2">
                    <div className="flex flex-row items-center">
                        <Image title="Digi Plus" src={'/Logo DIGI Plus Icono.png'} width={120} height={80} className="px-4 object-cover w-auto max-w-[100px] md:max-w-[110px]" alt="Digi Plus" />
                        <Image title="DBP Mining" src={'/logo_dbp_azul.png'} width={100} height={30} className="px-4 object-contain w-auto max-w-[60px] md:max-w-[70px] md:py-2" alt="DBP Mining" />
                    </div>
                    <div className="flex flex-row items-center justify-between w-fit">
                        <div className="flex flex-row items-center justify-center">
                            {session.clientId === BHP_COMPANY_ID && <Image title="BHP" src={'/BHP-Logo.png'} width={120} height={50} className="px-4 object-contain max-w-[80px] md:max-w-[200px] md:py-2" alt="BHP" />}

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

                    <button className="bg-primaryColor text-white font-semibold w-full px-4 py-2 text-xs" onClick={() => signOut()}>Cerrar sesión</button>
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
                        <Link href={`/private/${element.href}`} key={`sidebar-element-${index}`} className="flex items-center justify-start flex-row gap-2 py-2 px-4 w-full rounded-lg text-[#1C4167] hover:bg-white/10 hover:text-primaryColor group">
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
