"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { SignupButton } from "@/components/auth-components/signup-button";
import { LoginButton } from "@/components/auth-components/login-button";
import { LogoutButton } from "@/components/auth-components/logout-button";
import Banner from '@/components/home/banner';
import React from "react";
import Link from 'next/link';


const NavBar = ({protest}) => {
  const { user, error, isLoading } = useUser();
  return (
    <div className= 'flex-col '> 
      <div className='flex p-4 bg-white'> 
        <div className={`flex flex-grow-[1] items-center pl-12 text-4xl ${protest.className}`}>         
          Konko Bank 
        </div> 
        <div className='flex flex-grow-[8] justify-start font-serif items-center text-thin font-thin text-gray-600'> 
          <div className='flex justify-between flex-grow'> 
          {!user && !isLoading ? (<div> <a> Features </a> </div> ) : <div> <Link href='/dashboard'> Dashboard </Link> </div> }
            
            <div> <a> Platform </a> </div> 
            <div> <a> Testimonials </a> </div> 
            <div> <a> QNA </a> </div> 
          </div> 
        </div> 
        <div className="flex gap-4 flex-grow-[2] items-center justify-end pr-8">
          {!user && !isLoading && (
            <>
              <SignupButton />
              <LoginButton />

            </>
          )}
          {user && !isLoading && (
            <>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </div> 
  );
};

export default NavBar;

