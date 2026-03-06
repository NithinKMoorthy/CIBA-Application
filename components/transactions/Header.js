"use client";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Modal from "../modal/modal";

const Header = () => {
  const [currency, setCurrency] = useState("USD");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  // Open modal function
  const openModal = (title, msg) => {
    setTitle(title);
    setMessage(msg);
    setIsModalVisible(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const redirectToAuth0= () => {
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
      const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '');
      const baseUrl = process.env.NEXT_PUBLIC_AUTH0_BASE_URL || 'http://localhost:3000';
      const redirectUri = `${baseUrl}/api/auth/callback`;
      const state = 'yourOpaqueValue'; // Should be dynamically generated in a real scenario
      // const acrValues = 'http://schemas.openid.net/pape/policies/2007/06/multi-factor';

      // const authUrl = `https://${domain}/authorize?audience=https://${domain}/userinfo&scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&acr_values=${acrValues}`;
      const authUrl = `https://${domain}/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&customParam=${'hello'}`
      window.location.href = authUrl; // Redirect the user to the Auth0 authorization URL
  }
  // Handle send money logic
  const handleSendMoney = async () => {
    if (user) {
      try {
        const response = await axios.get("/api/auth/verify-mfa");
        const data = response.data;
        if (!data.mfaUsed) {
          console.log("REDIRECTING! ");
          redirectToAuth0(); 
          openModal("Unverified", "You are unverified, you must have a MFA challenge to prompt for MFA.");

        } else {
          openModal("Verified", "You are verified. Click okay to continue to send money.");
        }
      } catch (error) {
        console.error("Error verifying MFA:", error);
      }
    }
    // redirectToAuth0(); 
  };

  // Fetch token and manage MFA
  const fetchToken = async () => {
    try {
      const response = await axios.get("/api/auth/m2m", {
        headers: { "Content-Type": "application/json" },
      });
      const fetchedToken = response.data.token;
      setToken(fetchedToken);
      if (user) {
        manageMFA(fetchedToken);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  // Manage MFA with token and user ID
  const manageMFA = async (token) => {
    console.log("USER.SUB: ", user.sub);
    try {
      const response = await axios.post("/api/auth/getAuthenticators", { userId: user.sub });
      console.log("Authenticators:", response.data);
    } catch (error) {
      console.error("Error managing MFA:", error);
    }
  };
  // const addFactor = async (token) => {
  //   console.log("ADD FACTOR");

  //   try {
  //     const response = await axios.post(`${domain}/api/v2/users/${user.sub}/authentication-methods`, {
  //       type: "phone",
  //       phone_number: '4254355486'
  //     })
  //   }
  // }


  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md w-full h-[10%]">
      {/* Modal */}
      <Modal isVisible={isModalVisible} onClose={closeModal} title={title}>
        <p>{message}</p>
      </Modal>

      {/* Left Side: Total Balance and Currency Selector */}
      <div className="flex items-center space-x-3">
        <div className="text-lg font-light">Total Balance</div>
        <div className="text-lg font-semibold">$10,206.20</div>

        {/* Currency Selector */}
        <div className="flex items-center bg-white border border-gray-300 rounded px-2 py-1">
          <img src="/us-flag.png" alt="USD" className="w-6 h-6 mr-2" />
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
        <button
          onClick={fetchToken}
          className="flex items-center bg-white text-gray-700 px-4 py-2 rounded border border-gray-300"
        >
          Add Funds <FontAwesomeIcon icon={faDollarSign} className="ml-2 text-blue-500" />
        </button>
        <button
          onClick={handleSendMoney}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded"
        >
         Send Money <FontAwesomeIcon icon={faDollarSign} className="ml-2 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Header;
