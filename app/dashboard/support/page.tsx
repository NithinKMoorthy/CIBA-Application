"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser  } from "@auth0/nextjs-auth0/client";

export default function EnrollSMS() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { user  } = useUser();

  const [message, setMessage] = useState('');
  const [enrollmentTicket, setCustomEnrollmentTicket] = useState(''); 
  const [m2mToken, setM2MToken] = useState(''); 
  const getM2MToken = async () => {
            const response = await axios.get('/api/auth/m2m');
            return response.data.accessToken;
    }
  // Step 1: Enroll phone number and trigger SMS challenge
  useEffect(() => {
    console.log("Enrollment Ticket ");
    getTokenWithMFA(); 
    },[enrollmentTicket, message])

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
        m2mToken: token
      });
      console.log("Enrollment Response ", response.data);
      
      setCustomEnrollmentTicket(response.data.ticket_url);
    } catch (error) {
      console.error("Error enrolling SMS MFA:", error);
      setMessage("Failed to enroll SMS MFA");
    }
  };

  return (
    <div>
        <h1>Generate Custom Enrollment Ticket</h1>

        <button className='bg-black text-white w-[80px]'onClick={generateTicket}>Generate</button>
        <p><a href={enrollmentTicket}> {enrollmentTicket} </a> </p>
        <div> 
            <textarea className='border mt-2 w-full h-[100px] p-4' value={message} /> 
        </div> 
    </div>
  );
}



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
