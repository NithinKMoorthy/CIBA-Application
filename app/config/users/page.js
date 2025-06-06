'use client';
import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import { FaShieldAlt, FaBolt, FaUsers } from "react-icons/fa";

export default function usersPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();


  return (
    <div className="w-screen h-screen flex overflow-hidden">
      Users PAGE
    </div>
  );
}
