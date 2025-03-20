'use client'
// app/admin/layout.tsx
import React, { useState } from 'react';
import ProfileNav from '@/components/nav/ProfileNav';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Sidebar Toggle Button (Only visible on small screens) */}
      <button
        className="md:hidden p-2 bg-gray-700 text-white fixed top-4 left-4 z-50 rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <main className="flex flex-grow w-full">
        {/* Sidebar - Hidden on small screens, toggleable */}
        <div
          className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:max-w-[15%] md:border-r`}
        >
          <ProfileNav />
        </div>

        {/* Main content */}
        <div className="flex-grow w-full p-4 md:pl-4">{children}</div>
      </main>
    </div>
  );
}
