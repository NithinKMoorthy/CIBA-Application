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
    if (pathname === "/" || pathname === "/universal") {
      return <LoginButton />;
    }
    return null;
  };

  const handleLogin = () => {
    router.push("/api/auth/loginWithAuthCode");
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-6">
        {/* Logo */}
        <div className="flex items-center max-w-[15%]">
          <img src="./logo.png" alt="Logo" className="w-auto h-12" />
        </div>

        {/* Navigation Links */}
        <div className="flex-grow">
          <nav className="flex justify-around text-small gap-8 font-medium px-10 text-gray-600">
            {!user && !isLoading ? (
              <Link
                href="/universal"
                className={`${
                  isActiveRoute("/universal") || isActiveRoute("/")
                    ? "text-black font-semibold"
                    : "hover:text-black"
                }`}
              >
                Universal
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="hover:text-black font-medium text-gray-600"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/ropgLogin"
              className={`${
                isActiveRoute("/ropgLogin")
                  ? "text-black font-semibold"
                  : "hover:text-black"
              }`}
            >
              ROPG
            </Link>
            <a className="hover:text-black cursor-pointer">LockJS</a>
            <a className="hover:text-black cursor-pointer">QNA</a>
          </nav>
        </div>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-4">
          {!user && !isLoading && (
            <>
              <SignupButton />
              {renderAuthButton()}
            </>
          )}
          {user && !isLoading && <LogoutButton />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
