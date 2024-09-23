'use client';
import React,{useState, useEffect} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

const PrimaryAccountCard = () => {
    const { user, error, isLoading } = useUser();
    if(error) return <div> {error.message} </div> 
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-[400px] justify-center">
        {/* Title */}
        <div className="mb-2">
            <h3 className="text-md font-bold">Primary account</h3>
        </div>

        {/* Card Design */}
        <div className="relative bg-blue-600 text-white rounded-xl p-4 max-w-[350px] ">
            {/* Current Balance */}
            <div className="mb-6">
            <p className="text-sm">Current Balance</p>
            <h2 className="text-2xl font-bold">$10,206.20</h2>
            </div>

            {/* Cardholder Info */}
            <div className="flex justify-between items-center text-sm">
            <span>{isLoading ? "loading" : user?.name  } </span>
            <span>06/24</span>
            </div>

            {/* Card Number */}
            <div className="mt-4 text-lg">
            1234 1234 1234 1234
            </div>

            {/* MasterCard Logo */}
            <div className="absolute bottom-4 right-4">
            {/* You can replace this with an actual MasterCard logo SVG or image */}
            <span className="bg-yellow-500 text-red-500 rounded-full p-2">● ●</span>
            </div>

            {/* Wireless Payment Icon */}
            <div className="absolute top-4 right-4">
            {/* You can replace this with an actual wireless icon SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6 0v-6h-6"
                />
            </svg>
            </div>
        </div>
        </div>
    );
    };

export default PrimaryAccountCard;
