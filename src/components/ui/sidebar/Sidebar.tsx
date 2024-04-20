'use client';

import { logout } from "@/actions";
import { useUiStore } from "@/store/ui/ui-store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"


export const Sidebar = () => {

    const isSideMenuOpen = useUiStore(state => state.isSideMenuOpen)
    const closeSideMenu = useUiStore(state => state.closeSideMenu)

    const { data: session } = useSession();

    const isAdmin = session?.user.role === 'admin';
    const isAunthenticated = !!session?.user;

  return (
    <div>

        {/* Backcground black */}
        {
            isSideMenuOpen && (
                <div className='fixed top-0 left-0 z-10 w-screen h-screen bg-black opacity-30'/>
            )
        }

        {/* Blur */}
        {
            isSideMenuOpen && (
                <div 
                    className='fixed top-0 left-0 z-10 w-screen h-screen backdrop-filter backdrop-blur-sm'
                    onClick={() => closeSideMenu()}
                />
            )
        }

        {/* Sidemenu */}
        <nav 
            className={
                clsx(
                    'fixed top-0 right-0 z-20 bg-white w-[500px] h-screen p-5 shadow-2xl transform transition-all duration-300',
                    {
                        'translate-x-full': !isSideMenuOpen
                    }
                )
            }
        >

            <IoCloseOutline 
                size={ 50 } 
                className='absolute top-3 right-3 cursor-pointer' 
                onClick={() => closeSideMenu()}
            />

            {/* Input */ }
            <div className="relative mt-14">
                <IoSearchOutline size={ 20 } className="absolute top-2 left-2" />
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full bg-gray-50 rounded px-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Menú */ }

            {
                isAunthenticated && (
                    <>
                        <Link
                            href="/profile"
                            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoPersonOutline size={ 30 } />
                            <span className="ml-3 text-xl">Perfil</span>
                        </Link>

                        <Link
                            href="/orders"
                            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoTicketOutline size={ 30 } />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>

                        <button
                            className="flex w-full items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={ () => logout() }
                        >
                            <IoLogOutOutline size={ 30 } />
                            <span className="ml-3 text-xl">Salir</span>
                        </button>
                    </>
                )
            }

            {
                !isAunthenticated && (
                    <Link
                        href="/auth/login"
                        className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeSideMenu()}
                    >
                        <IoLogInOutline size={ 30 } />
                        <span className="ml-3 text-xl">Ingresar</span>
                    </Link>
                )
            }

            {
                isAdmin && (
                    <>
                        {/* Line Separator */ }
                        <div className="w-full h-px bg-gray-200 my-8" />


                        <Link
                            href="/admin/products"
                            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoShirtOutline size={ 30 } />
                            <span className="ml-3 text-xl">Productos</span>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoTicketOutline size={ 30 } />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoPeopleOutline size={ 30 } />
                            <span className="ml-3 text-xl">Usuarios</span>
                        </Link>
                    </>
                )
            }
        </nav>

    </div>
  )
}
