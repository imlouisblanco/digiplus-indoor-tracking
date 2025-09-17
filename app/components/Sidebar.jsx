"use client";
import Link from "next/link";

export const revalidate = 0;

export const Sidebar = ({ sidebarElements = [], session }) => {
  return (
    <section>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-48 h-screen mt-20 pt-8 sm:mr-44 transition-transform bg-gray-100 border-r border-gray-300 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full gap-4 flex p-2 flex-col items-center overflow-y-aut">
          {sidebarElements.map((element, index) => (
            <Link
              href={`/private/${element.href}`}
              key={`sidebar-element-${index}`}
              className="flex items-center justify-start flex-row gap-2 py-2 px-4 w-full rounded-lg text-[#1C4167] hover:bg-white/10 hover:text-primaryColor group"
            >
              {element.icon ?? (
                <svg
                  className="w-3 h-3 transition duration-75 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
              )}

              <span className="text-sm font-bold">{element.text}</span>
            </Link>
          ))}
          {
            (session.roleId === 1 || session.roleId === 4) && (
              <Link href="/private/users" className="flex items-center justify-start flex-row gap-2 py-2 px-4 w-full rounded-lg text-[#1C4167] hover:bg-white/10 hover:text-primaryColor group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
                <p className="text-sm font-bold">Usuarios</p>
              </Link>
            )
          }

        </div>
      </aside>
    </section>
  );
};
