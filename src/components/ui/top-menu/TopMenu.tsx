'use client';

import { titleFont } from "@/config/fonts";
import { useCartStore } from "@/store/cart/cart.store";
import { useUiStore } from "@/store/ui/ui-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5'

export const TopMenu = () => {

  const [loaded, setLoaded] = useState(false)

  const openSideMenu = useUiStore(state => state.openSideMenu)
  const totalItemsInCart = useCartStore(state => state.getProductsInCart())

  useEffect(() => {
    setLoaded(true)
  }, [])
  

  return (
    <nav className="flex w-full justify-between items-center px-4 py-2">

      {/* Logo */}
      <div>
        <Link href={"/"}>
          <span className={` ${titleFont.className} font-bold`}>Teslo</span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className='hidden sm:block'>
        <Link href={'/gender/men'} className='m-2 p-2 rounded-md hover:bg-gray-200 transition-all'>Hombres</Link>
        <Link href={'/gender/women'} className='m-2 p-2 rounded-md hover:bg-gray-200 transition-all'>Mujeres</Link>
        <Link href={'/gender/kid'} className='m-2 p-2 rounded-md hover:bg-gray-200 transition-all'>Niños</Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className='flex items-center'>

        <Link href={'/search'} className='mx-2'>
            <IoSearchOutline className='w-5 h-5'/>
        </Link>

        <Link 
           href={( (totalItemsInCart === 0) && loaded ) ? '/empty' : "/cart" } 
          className='mx-2'
        >
          <div className='relative'>
            {
              (loaded && totalItemsInCart > 0) && (
                <span className='fade-in absolute text-xs font-bold -top-2 -right-2 rounded-full bg-blue-700 text-white px-1'>
                  { totalItemsInCart }
                </span>
              )
            }
              <IoCartOutline className='w-5 h-5'/>
          </div>
        </Link>

        <button 
          className='hover:bg-gray-100 rounded-md mx-2 px-2 transition-all'
          onClick={() => openSideMenu()}
        >
            Menú
        </button>

      </div>    

    </nav>
  );
};
