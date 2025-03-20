'use client';
import React from "react";
import NavBar from "./navbar";
import { FaMobileAlt, FaShieldAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";

const Home = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 text-gray-900">
      <NavBar />
      
      <main className="flex flex-col items-center text-center justify-center flex-grow px-6 mt-32">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">The Future of Banking, Today</h2>
        <p className="text-lg max-w-2xl text-gray-600">
          Experience secure, fast, and reliable banking with Konko Heights. Open an account in minutes and manage your finances with ease.
        </p>
        <div className="mt-6">
          <button className="px-8 py-3 text-lg bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
            Get Started
          </button>
        </div>
      </main>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        <div className="p-6 text-center shadow-md bg-white rounded-lg transform hover:scale-105 transition">
          <FaMobileAlt className="text-blue-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mobile Banking</h3>
          <p className="text-gray-700">Manage your finances anywhere, anytime with our secure mobile app.</p>
        </div>

        <div className="p-6 text-center shadow-md bg-white rounded-lg transform hover:scale-105 transition">
          <FaShieldAlt className="text-purple-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Top-notch Security</h3>
          <p className="text-gray-700">Your funds and data are protected with industry-leading security measures.</p>
        </div>

        <div className="p-6 text-center shadow-md bg-white rounded-lg transform hover:scale-105 transition">
          <FaMoneyCheckAlt className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Transactions</h3>
          <p className="text-gray-700">Send, receive, and manage money effortlessly with our seamless transaction system.</p>
        </div>
      </section>

      <footer className="mt-16 text-center text-gray-600 py-6">
        <p>&copy; 2025 Konko Heights. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
