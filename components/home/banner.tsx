"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons'; // Party icon
import React from "react";
import NavBar from './navbar';

const Banner = () => {
  return (
      <div className='flex p-4 bg-black text-white text-center'> 
            
            <h1 className='flex-grow '> <FontAwesomeIcon icon={faGift} />  Start your journey with 20% discount  </h1> 
      </div>
  );
};
export default Banner;