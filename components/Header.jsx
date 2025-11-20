'use client';

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import {usePathname} from "next/navigation";
import UserDropDown from "@/components/UserDropDown";



const Header = ({user}) => {


    return (
       <header className="sticky top-0 header">
           <div className="container header-wrapper">
               <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="StockPilot logo" width={140} height={32}
                           className="h-8 w-auto cursor-pointer"/>
               </Link>
               <nav className="hidden sm:block">
                   <NavItems/>

               </nav>
               <UserDropDown user={user}/>
           </div>
       </header>
    )
}
export default Header
