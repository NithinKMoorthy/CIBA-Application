"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons'; // Party icon
import React from "react";
import Banner from '@/components/home/banner';
import Navbar from '@/components/home/navbar';
import { Protest_Guerrilla } from 'next/font/google';
const protestGuerrilla = Protest_Guerrilla({
  subsets: ['latin'],
  weight: ['400'], // Choose the weights if multiple options exist
  display: 'swap',  // Optional for better performance
});
const Home = () => {
  return (
      <div className='flex flex-col flex-grow '>      
           <Banner /> 
           <Navbar protest={protestGuerrilla}/> 
           <div className="flex flex-grow justify-center items-center bg-cover bg-[url('/background.png')]">
           </div> 


      </div>
  );
};
export default Home;