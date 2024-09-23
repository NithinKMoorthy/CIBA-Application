"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons'; // Party icon
import React from "react";
import Banner from '@/components/home/banner';
import Navbar from '@/components/home/navbar';

const Home = () => {
  return (
      <div className='flex flex-col flex-grow '>      
           <Banner /> 
           <Navbar/> 
           <div className="flex flex-grow justify-center items-center bg-cover bg-[url('/background.png')]">
           </div> 


      </div>
  );
};
export default Home;