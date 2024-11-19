"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { SignupButton } from "@/components/auth-components/signup-button";
import { LoginButton } from "@/components/auth-components/login-button";
import { LoginWithROPG } from "@/components/auth-components/login-with-ropg-button";

import { LogoutButton } from "@/components/auth-components/logout-button";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isActiveRoute = (route) => pathname === route;

  const renderAuthButton = () => {
    if (pathname === "/ropgLogin") {
      return <LoginWithROPG />;
    }
    if (pathname === "/" || pathname === '/universal') {
      return <LoginButton />;
    }
    return null;
  };

  const handleLogin = () => {
    router.push("/api/auth/loginWithAuthCode");
  };

  return (
    <div className="flex-col bg-white">
      <div className="flex p-4">
        {/* Logo */}
        <div className="flex flex-grow-[1] items-center max-w-[15%] p-2 px-10">
          <img src="./logo.png" alt="Logo" />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-grow-[8] justify-start font-serif items-center text-thin font-thin text-gray-600 p-2">
          <div className="flex justify-between flex-grow">
            {!user && !isLoading ? (
              <div>
                <a className={`${
                  isActiveRoute("/universal") || isActiveRoute('/')? "text-lg font-bold" : ""
                }`}><Link href='/universal'> Universal </Link></a>
              </div>
            ) : (
              <div>
                <Link href="/dashboard">Dashboard</Link>
              </div>
            )}
            <div>
              <Link
                href="/ropgLogin"
                className={`${
                  isActiveRoute("/ropgLogin") ? "text-lg  font-bold" : ""
                }`}
              >
                ROPG
              </Link>
            </div>
            <div>
              <a>LockJS</a>
            </div>
            <div>
              <a>QNA</a>
            </div>
          </div>
        </div>

        {/* Authentication Buttons */}
        <div className="flex gap-4 flex-grow-[2] items-center justify-end pr-8">
          {!user && !isLoading && (
            <>
              <SignupButton />
              {renderAuthButton()}

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
