"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMessage } from '@fortawesome/free-solid-svg-icons'; // Party icon
import Link from "next/link";

const UsedSpace = () => {
  return (
    <div className="flex flex-col"> 
        <div className='space-y-2 p-2'> 
            <div className='hover:bg-blue-500 hover:text-white rounded flex  w-full p-2 items-center justify-start p-2'> <FontAwesomeIcon icon={faMessage} /> <div className="ml-2"><Link href='/dashboard/support'>  Support </Link> </div> </div>
            <div className='hover:bg-blue-500 hover:text-white rounded flex  w-full p-2 items-center justify-start p-2 mb-2'> <FontAwesomeIcon icon={faGear} /> <div className="ml-2"> Settings </div>  </div>
        </div> 
        <div className='p-2'> 
        <div className="bg-blue-600 text-white rounded-lg p-4 shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Used space</h3>
            <button className="text-white font-bold">
            &times;
            </button>
        </div>

        {/* Message */}
        <p className="mb-4">
            Your team has used <span className="font-bold">80%</span> of your available space. Need more?
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-blue-500 rounded-full h-2.5 mb-4">
            <div className="bg-blue-300 h-2.5 rounded-full" style={{ width: '80%' }}></div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
            <button className="text-blue-300 hover:underline">
            Dismiss
            </button>
            <button className="text-white font-bold hover:underline">
            Upgrade plan
            </button>
        </div>
        </div>
        </div>
    </div>
  );
};

export default UsedSpace;
