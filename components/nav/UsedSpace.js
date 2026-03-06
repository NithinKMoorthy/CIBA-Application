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
    </div> 
  );
};

export default UsedSpace;
