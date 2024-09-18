"use client";
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Assuming this is a default export

const TokenDisplay = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [decodedIdToken, setDecodedIdToken] = useState<any>(null);

  // Fetch token (replace with your actual API logic)
  const getToken = async () => {
    try {
      const response = await fetch("/api/auth/token", {
        method: "GET",
      });
      const data = await response.json();
      console.log("data", data);
      setAccessToken(data.accessToken);
      setIdToken(data.idToken);

      if (data.idToken) {
        const decoded = jwtDecode(data.idToken);
        setDecodedIdToken(decoded);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    
    getToken();
  }, []);

  useEffect(() => {
    console.log('idToken:', idToken);
  }, [idToken])
  return (
    <div className="flex flex-col h-full">
      <div className='flex flex-grow'> 
        <div className=' flex-grow max-w-[50%] p-4'> 
            <div className='font-bold p-2'> Encoded Id Token </div> 
            <textarea className="bg-white p-4 mt-2 border border-gray-300 rounded-md border-gray-300 overflow-hidden h-[50%] w-full text-xs" value={idToken || "Loading..."}>
               
            </textarea>
        </div>
        <div className='flex flex-col flex-grow p-4 max-w-[100%]'> 
            <div className="font-bold p-2"> 
                Decoded Header
            </div> 
            <pre className="bg-white p-4 rounded-md border border-gray-300 overflow-auto h-[30%] text-sm mt-2">
                    {JSON.stringify(
                     {
                         alg: "RS256", // Default algorithm, can be pulled from JWT header if needed
                        typ: "JWT",
                        kid: decodedIdToken?.kid || "w6r91UW9vXqnuvsz5OgSM", // Example key ID
                    },
                    null,
                     2
                   )}
            </pre>
            <div className=' font-bold p-2'> 
                Decoded Payload 
            </div> 
            <textarea className="bg-white border border-gray-300 p-4 rounded-md  border-gray-300 overflow-hidden text-sm h-full" value={JSON.stringify(decodedIdToken, null, 2)}>
                    
            </textarea>  
        </div>
        
      </div> 
      {/* Encoded Token Section */}
      
    </div> 
  );
};

export default TokenDisplay;



// <div className="flex"> 
//         <div className="max-w-[20%]">
//             <h2 className="text-lg font-semibold mb-2">Encoded ID Token:</h2>
//             <pre className="bg-white p-4 rounded-md border border-gray-300 overflow-auto max-h-60 break-all text-sm">
//             {idToken ? idToken : "Loading..."}
//             </pre>
//         </div>

//         {/* Decoded Token Section */}
//         {decodedIdToken ? (
//             <div className="flex flex-col w-full max-w-4xl">
//             <h2 className="text-lg font-semibold mb-2">Decoded ID Token:</h2>

//             <div className="grid grid-cols-2 gap-6">
  
//                 <div>
//                 <h3 className="text-md font-semibold">Header:</h3>
//                 <pre className="bg-white p-4 rounded-md border border-gray-300 overflow-auto max-h-40 text-sm">
//                     {JSON.stringify(
//                     {
//                         alg: "RS256", // Default algorithm, can be pulled from JWT header if needed
//                         typ: "JWT",
//                         kid: decodedIdToken.kid || "w6r91UW9vXqnuvsz5OgSM", // Example key ID
//                     },
//                     null,
//                     2
//                     )}
//                 </pre>
//                 </div>

//                 {/* Payload Section */}
//                 <div>
//                 <h3 className="text-md font-semibold">Payload:</h3>
//                 <pre className="h-full bg-white p-4 rounded-md border border-gray-300 overflow-auto max-h-40 text-sm">
//                     {JSON.stringify(decodedIdToken, null, 2)}
//                 </pre>
//                 </div>
//             </div>
//             </div>
//         ) : (
//             <div>Decoding token...</div>
//         )}
//         </div>