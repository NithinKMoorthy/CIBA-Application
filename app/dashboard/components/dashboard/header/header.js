"use client";
import React from 'react';
import SearchBar from '@/app/dashboard/components/dashboard/header/searchbar'
const header = () => {
  return (
    <div className="flex justify-between p-4 w-full  ">
      {/* Left Side: Title and Subtitle */}
      <div>
        <div className="text-2xl font-bold">Banking Dashboard</div>
        <div className="text-sm text-gray-600 mt-2">Welcome back, Nithin</div>
      </div>

      {/* Right Side: Search Placeholder */}
      <div className="text-gray-600"><SearchBar /> </div>

    </div>
  );
};

export default header;
