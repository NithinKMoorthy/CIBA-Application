"use client";
import React, { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';


import axios from 'axios';
// type Authenticator = {
//   id: string;
//   name: string;
//   type: string;
//   description: string;
//   status: "Enabled" | "Disabled" | "Configured";
//   lastUpdated: string;
//   details: Record<string, any>;
// };



const AuthenticatorDashboard = () => {
  const sampleAuthenticators = [
    {
      id: "1",
      name: "Password Authenticator",
      type: "Core Credential",
      description: "Standard password-based authentication.",
      status: "Enabled",
      lastUpdated: "Feb 8, 2025",
      details: {},
    },
    {
      id: "2",
      name: "SMS OTP",
      type: "Two-Factor",
      description: "Sends a one-time code via SMS to registered mobile numbers.",
      status: "Enabled",
      lastUpdated: "Feb 5, 2025",
      details: {
        provider: "Nexmo",
        codeLength: 6,
      },
    },
    {
      id: "3",
      name: "TOTP Authenticator",
      type: "Two-Factor",
      description:
        "Uses a time-based algorithm. Users scan a QR code with an authenticator app like Google Authenticator.",
      status: "Configured",
      lastUpdated: "Feb 1, 2025",
      details: {
        note: "QR Code available for reconfiguration",
      },
    },
    {
      id: "4",
      name: "Push Notification Authenticator",
      type: "Adaptive/Push",
      description:
        "Sends a push notification to a linked mobile app for approval.",
      status: "Enabled",
      lastUpdated: "Jan 29, 2025",
      details: {
        device: "iPhone 14 Pro",
      },
    },
    {
      id: "5",
      name: "Biometric Authenticator",
      type: "Advanced/Local Device",
      description:
        "Uses fingerprint or face recognition on supported devices for quick login.",
      status: "Enabled",
      lastUpdated: "Feb 10, 2025",
      details: {
        lastSynced: "Feb 9, 2025",
      },
    },
  ];
  const [enrollmentTicket, setCustomEnrollmentTicket] = useState(''); 
    const [message, setMessage] = useState('');

  const getM2MToken = async () => {
            const response = await axios.get('/api/auth/m2m');
            return response.data.accessToken;
    }
  const generateTicket = async () => {
        console.log("Enrollment Ticket: ");
        let token = await getM2MToken(); 
        try {
          const response = await axios.post('/api/auth/generateCustomEnrollmentTicket', {
            userId: user?.sub,
            m2mToken: token
          });
          console.log("Enrollment Response ", response.data);
          
          setCustomEnrollmentTicket(response.data.ticket_url);
        } catch (error) {
          console.error("Error enrolling SMS MFA:", error);
          setMessage("Failed to enroll SMS MFA");
        }
      };
    
  
  const [authenticators, setAuthenticators] = useState(sampleAuthenticators);
  const { user, error, isLoading } = useUser();
  console.log("USER : ", user);
   const getToken = async () => {
    let response= await axios.get('/api/auth/getAccessTokenForUser');
    console.log("RESPONSE.data: ", response.data);
   }
   const getAuthenticators = async () => {
    let userId= user?.sub;
    try {
      const response = await axios.post('/api/auth/getAuthenticators', {
        userId: userId?.trim(),
      });
  
      console.log('Authenticators', response.data);

    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to fetch authenticators');
    }
  };
  
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setAuthenticators(sampleAuthenticators);
    }, 500);
  }, []);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this authenticator?")) {
      setAuthenticators((prev) => prev.filter((auth) => auth.id !== id));
      console.log("Deleted authenticator with id:", id);
    }
  };

  const handleEdit = () => {
    // Open an edit modal or redirect to edit page
    console.log("Editing authenticator with id:", id);
  };

  const handleAdd = () => {
    // Open a modal or navigate to the add authenticator page
    console.log("Add new authenticator clicked");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Authentication Methods</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Authenticator
        </button>
      </div>
      <button onClick={getToken} className="bg-blue-600 px-5" > 
        Get Token
      </button>
      <button onClick={generateTicket}> 
        Create Custom Enrollment Ticket   
      </button>
      <button onClick={getAuthenticators} className="bg-blue-600 px-5" > 
        GET AUTHENTICATORS 
      </button>
      <h1> {enrollmentTicket} </h1> 
      {/* Vertical Cards List */}
      <div className="flex flex-col space-y-6">
        {authenticators.length > 0 ? (
          authenticators.map((auth) => (
            <div
              key={auth.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{auth.name}</h2>
                <p className="text-sm text-gray-500">{auth.type}</p>
              </div>
              <p className="text-gray-700 mb-2">{auth.description}</p>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    auth.status === "Enabled"
                      ? "text-green-600"
                      : auth.status === "Disabled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {auth.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Last Updated:</span>{" "}
                {auth.lastUpdated}
              </div>
              {Object.keys(auth.details).length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Details:</p>
                  <pre className="bg-gray-100 text-xs p-2 rounded">
                    {JSON.stringify(auth.details, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-auto flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => handleEdit(auth.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(auth.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">Loading authenticators...</div>
        )}
      </div>
    </div>
  );
};

export default AuthenticatorDashboard;


// "use client"
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useUser  } from "@auth0/nextjs-auth0/client";

// export default function EnrollSMS() {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const { user  } = useUser();

//   const [message, setMessage] = useState('');
//   const [enrollmentTicket, setCustomEnrollmentTicket] = useState(''); 
//   const [m2mToken, setM2MToken] = useState(''); 
//   const getM2MToken = async () => {
//             const response = await axios.get('/api/auth/m2m');
//             return response.data.accessToken;
//     }
//   // Step 1: Enroll phone number and trigger SMS challenge
//   useEffect(() => {
//     console.log("Getting MFA Token from UseEffect");
//     getTokenWithMFA(); 
//     },[enrollmentTicket, message])

//     const getTokenWithMFA = async () => {
//         const response = await axios.get('/api/auth/getAccessTokenForUser');
//         console.log("Response.data: ", response.data);
//         setMessage(response.data.accessToken);
//     };
        
//   const generateTicket = async () => {
//     let token = await getM2MToken(); 
//     try {
//       const response = await axios.post('/api/auth/generateCustomEnrollmentTicket', {
//         userId: user?.sub,
//         phoneNumber,
//         m2mToken: token
//       });
//       console.log("Enrollment Response ", response.data);
      
//       setCustomEnrollmentTicket(response.data.ticket_url);
//     } catch (error) {
//       console.error("Error enrolling SMS MFA:", error);
//       setMessage("Failed to enroll SMS MFA");
//     }
//   };

//   return (
//     <div>
//         <h1>Generate Custom Enrollment Ticket</h1>

//         <button className='bg-black text-white w-[80px]'onClick={generateTicket}>Generate</button>
//         <p><a href={enrollmentTicket}> {enrollmentTicket} </a> </p>
//         <div> 
//             <textarea className='border mt-2 w-full h-[100px] p-4' value={message} /> 
//         </div> 
//     </div>
//     // <div> 
//     //   Hello
//     // </div>
//   );
// }



// "use client";
// import React, {useState, useEffect} from 'react';
// import { useUser  } from "@auth0/nextjs-auth0/client";

// import axios from 'axios';
// const support = () => {

//     let [message,setMessage] = useState('');
//     let [m2mToken, setM2MToken] = useState(''); 
//     let [userAccessToken, setUserAccessToken] = useState('');
//     let [userTokenMFA, setUserTokenMFA] = useState(''); 
//     let [authenticators, setAuthenticators] = useState([]); 
//     const { user, getAccessTokenSilently  } = useUser();
//     const [phoneNumber, setPhoneNumber] = useState('');

//     console.log("USER: ", user);
//     const getUserAccessTokenServerSide = async () => {
//         const response = await axios.get('/api/auth/getAccessTokenForUser')                
//         setUserAccessToken(response.data.accessToken); 
//         setMessage(userAccessToken);
//     }
//     const getM2MToken = async () => {
//         const response = await axios.get('/api/auth/m2m');
//         setM2MToken(response.data.accessToken); 
//         setMessage(m2mToken); 
//     }
//     const getAuthenticatorsForUser= async () => {
//         const response = await axios.post('/api/auth/getAuthenticators',{userId: user.sub});
//         console.log("RESPONSE: ", response.data);
//         setAuthenticators(response.data)
//         setMessage(JSON.stringify(authenticators));

//     }
//     const enrollSMS = async () => {
//         console.log("M2MToken: ", m2mToken);
//         const response = await axios.post(`/api/auth/setSMSMFA`, 
//             {
//                 phoneNumber, 
//                 m2mToken,
//                 phone_verified: false,
//                 userId: user?.sub
//             },
//         );
//         console.log("Response: ", response); 
//     }

    
//       return (
//         <div className="flex flex-col"> 
//             Support - This is for Dev PlayGround, do not click on this. 
//             <div> 
//                 <button className='h-[100px] w-[100px] border mt-2' onClick={getUserAccessTokenServerSide}> Get User Access Token ClientSide </button>
//             </div> 
//             <div> 
//                 <button className='h-[100px] w-[100px] border mt-2' onClick={getM2MToken}> Get M2M Access Token </button> 
//             </div>
//             <div> 
//                 <button className='h-[100px] w-[100px] border mt-2' onClick={getAuthenticatorsForUser}> Get Authenticators </button> 
//             </div>
//             <div> 
//                 <input type='tel' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /> 
//                 <button className='h-[100px] w-[100px] border mt-2' onClick={enrollSMS}> Enroll in SMS </button> 
//             </div>
//             {/* <div> 
//                 <button className='h-[100px] w-[100px] border mt-2' onClick={getAccessTokenWithMFA}> Get Access Token Client Side MFA </button> 
//             </div> */}
//             <div> 
//                 <textarea className='border mt-2 w-full h-[100px] p-4' value={message} /> 
//             </div> 

//         </div>
//     );
// };

// export default support;
