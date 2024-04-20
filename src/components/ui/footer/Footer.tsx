import { titleFont } from '@/config/fonts'
import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <div className='flex justify-center w-full mb-10 text-xs'>

        <Link 
            href={'/'}
        >
            <span className={`${ titleFont.className } antialiased font-bold`}>Teslo </span>
            <span>| Shop </span>
            <span>© { new Date().getFullYear() }</span>
        </Link>

        <Link 
            href={'/'}
            className='mx-3'
        >
            <span>Privacidad & Legal</span>
        </Link>
        
        <Link 
            href={'/'}
            className='mx-3'
        >
            <span>Ubicaciones</span>
        </Link>


    </div>
  )
}
