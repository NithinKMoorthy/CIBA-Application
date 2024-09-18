"use client";

import React from "react";
import UsedSpace from "@/app/dashboard/components/nav/used-space";
import { Protest_Guerrilla } from '@next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCreditCard,faFileInvoice,faChartLine, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // Party icon
import { usePathname } from "next/navigation"; // Correct hook for app directory routing
import Link from "next/link";
// Initialize the Protest Guerrilla font
const protestGuerrilla = Protest_Guerrilla({
  subsets: ['latin'],
  weight: ['400'], // You can add more weights if needed
  display: 'swap',  // Ensures better performance
});

const ProfileNav = () => {
  const pathname = usePathname(); 
  const isActive = (path) => pathname === path; 
  return (
    <div className="flex flex-col flex-grow h-full w-full ">
      {/* Logo Section */}
      {/* Brand Section with Protest Guerrilla Font */}
      <div className={`flex p-5 items-center pl-2 text-3xl ${protestGuerrilla.className}  justify-start ml-2`}>
       <Link href='/'> Konko Bank </Link>
      </div> 
      {/* Navigation Links */}
      <div className="flex flex-grow-[3] flex-col items-start justify-start rounded flex-grow  space-y-2 p-2 font-serif ">
        <div className={`flex w-full p-2 items-center justify-start rounded ${isActive('/dashboard') ? 'bg-blue-500 text-white font-bold hover:none' : 'text-black hover:bg-blue-200 hover:text-white'} `}>
          <FontAwesomeIcon icon={faHouse} />
          <div className="ml-2"> <Link href='/dashboard'> Dashboard </Link></div>
        </div>
        <div className={`${isActive('/dashboard/card') ? 'bg-blue-500 text-white font-bold hover:none' : 'text-black hover:bg-blue-200 hover:text-white'}  rounded flex  w-full p-2 items-center justify-start p-2`}> <FontAwesomeIcon icon={faCreditCard} /> <div className="ml-2">Card</div> </div>
        <div className={`${isActive('/dashboard/transactions') ? 'bg-blue-500 text-white font-bold hover:none' : 'text-black hover:bg-blue-200 hover:text-white'}  rounded flex  w-full p-2 items-center justify-start p-2`}> <FontAwesomeIcon icon={faFileInvoice} /><div className="ml-2"> <Link href='/dashboard/transactions'> Transaction </Link></div>  </div>
        <div className={`${isActive('/dashboard/reporting') ? 'bg-blue-500 text-white font-bold hover:none' : 'text-black hover:bg-blue-200 hover:text-white'}  rounded flex  w-full p-2 items-center justify-start p-2`}><FontAwesomeIcon icon={faChartLine} /><div className="ml-2">  Reporting </div>  </div>
        <div className={`${isActive('/dashboard/accounts') ? 'bg-blue-500 text-white font-bold hover:none' : 'text-black hover:bg-blue-200 hover:text-white'}  rounded flex  w-full p-2 items-center justify-start p-2`}><FontAwesomeIcon icon={faUser} /><div className="ml-2">  <Link href="/dashboard/accounts">Account </Link></div></div>
      </div>

      {/* Blank Div (Placeholder) */}
      <div> 
        <div className="flex-grow-[3] ">
          <UsedSpace />
        </div>

        
        <div className="p-4 border-t border-black">
          <div className='hover:bg-gray-500 hover:text-white rounded flex  w-full p-2 items-center justify-start p-2'><FontAwesomeIcon icon={faRightFromBracket} />
            <div className="ml-2">  <a href="/api/auth/logout">Logout  </a></div>
          </div>
        </div>
        </div>
    </div> 
  );
};

export default ProfileNav;
