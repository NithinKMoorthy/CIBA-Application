'use client';
import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import { FaShieldAlt, FaBolt, FaUsers, FaArrowLeft } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const navItems = [
    { href: "/config/mfa", label: "MFA", icon: <FaShieldAlt /> },
    { href: "/config/actions", label: "Actions", icon: <FaBolt /> },
    { href: "/config/users", label: "Users", icon: <FaUsers /> },
  ];

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-white text-gray-800">
      <aside className="w-56 border-r border-gray-200 px-4 py-6 flex flex-col">
      <div className='mb-4 p-2'> 
        <img src="./logo.png" alt="Logo" className="h-10 w-auto" />
      </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-all
                ${
                  pathname === item.href
                    ? "bg-gray-100 font-medium text-blue-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-all"
          >
            <FaArrowLeft className="text-base" />
            Back to App
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
