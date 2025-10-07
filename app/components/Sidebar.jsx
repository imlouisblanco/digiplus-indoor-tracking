"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const revalidate = 0;

export const Sidebar = ({ sidebarElements = [], session }) => {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '') {
      return pathname === '/private' || pathname === '/private/';
    }
    return pathname.startsWith(`/private/${href}`);
  };

  return (
    <section>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-56 h-screen mt-20 pt-6 transition-transform bg-gradient-to-b from-white via-emerald-50/30 to-white border-r-2 border-emerald-100 sm:translate-x-0 shadow-xl`}
        aria-label="Sidebar"
      >
        <div className="h-full gap-2 flex p-3 flex-col overflow-y-auto">
          {/* Título de navegación */}
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navegación</p>
          </div>

          {/* Links del sidebar */}
          {sidebarElements.map((element, index) => {
            const active = isActive(element.href);
            return (
              <Link
                href={`/private/${element.href}`}
                key={`sidebar-element-${index}`}
                className={`
                  relative flex items-center justify-start flex-row gap-3 py-3 px-4 w-full rounded-xl
                  transition-all duration-300 group
                  ${active
                    ? 'bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }
                `}
              >
                {/* Indicador de activo */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}

                {/* Ícono */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${active
                    ? 'bg-white/20'
                    : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                  }
                `}>
                  {element.icon ?? (
                    <svg
                      className="w-4 h-4 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                  )}
                </div>

                {/* Texto */}
                <span className={`text-sm font-semibold transition-all ${active ? 'text-white' : 'group-hover:translate-x-0.5'}`}>
                  {element.text}
                </span>
              </Link>
            );
          })}

          {/* Divisor */}
          {(session.roleId === 1 || session.roleId === 4) && (
            <div className="my-2 px-3">
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Administración</p>
            </div>
          )}

          {/* Link de usuarios (solo para admin) */}
          {(session.roleId === 1 || session.roleId === 4) && (
            <Link
              href="/private/users"
              className={`
                relative flex items-center justify-start flex-row gap-3 py-3 px-4 w-full rounded-xl
                transition-all duration-300 group
                ${isActive('users')
                  ? 'bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }
              `}
            >
              {/* Indicador de activo */}
              {isActive('users') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}

              {/* Ícono */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${isActive('users')
                  ? 'bg-white/20'
                  : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                }
              `}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
              </div>

              {/* Texto */}
              <p className={`text-sm font-semibold transition-all ${isActive('users') ? 'text-white' : 'group-hover:translate-x-0.5'}`}>
                Usuarios
              </p>
            </Link>
          )}
        </div>
      </aside>
    </section>
  );
};
