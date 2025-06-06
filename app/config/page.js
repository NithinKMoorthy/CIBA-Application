'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname, useRouter } from "next/navigation";
import { FaShieldAlt, FaBolt, FaUsers } from "react-icons/fa";
import axios from "axios";

export default function MfaPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    router.replace("/config/mfa");
  }, []);

  return null; // Or a loading spinner if you prefer
}
