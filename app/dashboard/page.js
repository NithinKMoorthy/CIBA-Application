'use client'
import React from 'react';
import axios from 'axios';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import {useState} from 'react';
// import Header from '../../components/dashboard/header/Header';
// import Filter from '../../components/dashboard/filter/Filter';
// import HighLevelAccountInfo from '../../components/dashboard/high-level-account-info/HighLevelAccountInfo';
// import DeeperAccount from '../../components/dashboard/graphs/DeeperAccount/DeeperAccount';
import Card from '@/components/dashboard/graphs/card';
import Expenses from '@/components/dashboard/graphs/total-expense';
import Income from '@/components/dashboard/graphs/total-income';
import MoneyFlowChart from '@/components/dashboard/graphs/DeeperAccount/money-chart';
import TransactionComponent from '@/components/dashboard/graphs/DeeperAccount/transactions';
import SearchBar from '@/components/dashboard/header/SearchBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFilter } from "@fortawesome/free-solid-svg-icons";

const Profile =  () => {
    
    return (
        <div className="flex flex-col flex-grow p-4 min-h-screen w-full">
            <Header />
            <div className="w-full flex flex-col gap-4">
                <Filter className="w-full md:w-1/4" />
                <HighLevelAccountInfo className="w-full md:w-3/4" />
            </div>
            <div className="w-full mt-4">
                <DeeperAccount />
            </div>
        </div>
    );
}

export default Profile;



const Header = () => {
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



// "use client" 
// import React, { useState } from "react";

const Filter = () => {
  const [selected, setSelected] = useState("30 days");

  const timeRanges = ["12 months", "30 days", "7 days", "24 hours"];

  return (
    <div className="flex justify-between items-center space-x-4  p-2">
      {/* Time Range Buttons */}
      <div className="flex ">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelected(range)}
            className={`px-4 py-2 border rounded-md ${
              selected === range ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Action Buttons: Select Dates and Filters */}
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 border rounded-md bg-white text-black">
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          Select dates
        </button>
        <button className="flex items-center px-4 py-2 border rounded-md bg-white text-black">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filters
        </button>
      </div>
    </div>
  );
};

const HighLevelAccountInfo = async () => {
    return (
        <div className="flex p-4 justify-around "> 
            <Card /> 
            <Income /> 
            <Expenses />
        </div>   
    )
}

const DeeperAccount = () => {
  return (
    <div className="flex justify-around flex-grow ">
        <MoneyFlowChart />
        <TransactionComponent /> 
    </div>
  );
};