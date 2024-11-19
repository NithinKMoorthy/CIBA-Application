"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons'; // Party icon
import React, { useEffect } from "react";
import Banner from '@/components/home/banner';
import Navbar from '@/components/home/navbar';
import { useUser, getAccessTokenSilently } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
const Home = () => {
  const { user, isAuthenticated, isLoading } = useUser();

  // Function to get the MFA access token


  return (
    <div className="flex flex-col flex-grow  bg-cover bg-no-repeat">      
      {/* <Banner />  */}
      {/* <Navbar />  */}
      <div className="flex flex-grow justify-center items-center bg-[url('/background.png')]">
      </div> 
    </div>
  );
};

export default Home;
