"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function EnrollSMS() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { user } = useUser();

  const [message, setMessage] = useState('');
  const [enrollmentTicket, setCustomEnrollmentTicket] = useState('');
  const [m2mToken, setM2MToken] = useState('');

  const getM2MToken = async () => {
    const response = await axios.get('/api/auth/m2m');
    return response.data.accessToken;
  };

  // Trigger an update to the message whenever enrollmentTicket or message changes.
  useEffect(() => {
    getTokenWithMFA();
  }, [enrollmentTicket, message]);

  const getTokenWithMFA = async () => {
    const response = await axios.get('/api/auth/getAccessTokenForUser');
    console.log("Response.data: ", response.data);
    setMessage(response.data.accessToken);
  };

  const generateTicket = async () => {
    let token = await getM2MToken();
    try {
      const response = await axios.post('/api/auth/generateCustomEnrollmentTicket', {
        userId: user?.sub,
        phoneNumber,
        m2mToken: token,
      });
      console.log("Enrollment Response ", response.data);
      setCustomEnrollmentTicket(response.data.ticket_url);
    } catch (error) {
      console.error("Error enrolling SMS MFA:", error);
      setMessage("Failed to enroll SMS MFA");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Custom Enrollment Ticket</h1>
      
      <input 
        type="text"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button 
        className="bg-black text-white px-4 py-2 mb-4"
        onClick={generateTicket}
      >
        Generate
      </button>
      
      {enrollmentTicket && (
        <p className="mb-4">
          <a href={enrollmentTicket} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {enrollmentTicket}
          </a>
        </p>
      )}

      <textarea 
        className="border mt-2 w-full h-24 p-4"
        value={message}
        readOnly
      />
    </div>
  );
}
