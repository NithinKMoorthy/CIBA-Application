"use client"
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Modal from '../modal/modal';

const Header =  () => {
    const [currency, setCurrency] = useState("USD");  
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [message, setMessage] = useState(''); 
    const [title, setTitle] = useState(''); 
    const { user } = useUser();
    const [userId, setUserId] =  useState(''); 
    const [token,setToken] = useState(''); 
    const openModal = (title, msg) => {
        setMessage(msg);
        setTitle(title);
        setIsModalVisible(true);
      };
    
      const closeModal = () => {
        setIsModalVisible(false);
      };
    const handleSendMoney = async () => {
        console.log("Check", user);
        setUserId(user.sub)
        if(user) {
            try {
                const response = await fetch('/api/auth/verify-mfa', {
                    method: 'GET',
                });
                const data = await response.json();
                console.log("DATA: ", data);
                if(!data.mfaUsed) {
         
                    openModal('MFA required', 'For your security, we need additional verification to proceed.');
                } else {
                    openModal('Verified', 'You are verified, click okay to continue to send money. ')
                }
            }
            catch(error) {
                console.log("Error:", error);
            }
        }
    }
    const fetchToken = async () => {
      const response = await axios.get('/api/m2m', {headers: {'Content-Type': 'application/json'}});
      setToken(response.data.token); 
      manageMFA(token);
    }
    const manageMFA = async(token) => {
      console.log("Token", token); 
      const response = await axios.get(`https://dev-ow0gmshf.us.auth0.com/api/v2/users/${userId}/authenticators`, {headers: {'Authorization': `Bearer ${token}`}})
      console.log("Response: ", response.data);
    }
    console.log("Token: ", token);
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md w-full h-[10%]">
        <Modal isVisible={isModalVisible} onClose={closeModal} title={title}>
            <p>{message}</p>
        </Modal>
      {/* Left Side: Total Balance */}
      <div className="flex items-center space-x-3">
        <div className="text-lg font-light">Total Balance</div>
        <div className="text-lg font-semibold">$10,206.20</div>

        
        {/* Currency Selector */}
        <div className="flex items-center bg-white border border-gray-300 rounded px-2 py-1">
          <img src="/us-flag.png" alt="USD" className="w-6 h-6 mr-2" /> {/* Assuming an image of the flag */}
          <select
            className="text-sm text-gray-700 focus:outline-none"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {/* Right Side: Add Funds and Send Money Buttons */}
      <div className="flex items-center space-x-3">
        <button onClick={fetchToken} className="flex items-center bg-white text-gray-700 px-4 py-2 rounded border border-gray-300">
          Add Funds{" "}
          <FontAwesomeIcon icon={faDollarSign} className="ml-2 text-blue-500" />
        </button>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendMoney}>
          Send money{" "}
          <FontAwesomeIcon icon={faDollarSign} className="ml-2 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Header;
