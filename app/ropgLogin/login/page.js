'use client'

import { useState, useEffect } from 'react'
import axios from 'axios';
export default function Component() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [mfaToken, setMfaToken] = useState(''); 
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [associate, setAssociate] = useState(false);
  const [otp, setOtp] = useState('');

  
  const handleLogin = async () => {
    console.log("HELLO");
    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/ROPG', { username, password })
      const data = response.data;
      console.log("RESPONSE.DATA: ", data);

      if (data.access_token) {
        console.log('Access Token:', data.access_token)
        setAccessToken(data.access_token);
        // promptMFA(data.access_token); 
        setError('')
      } else {
        setError(data.error || 'Login failed')
        console.log("data: ", data);
      }
    } catch (err) {
      // setError(err.response?.data?.error || 'An error occurred. Please try again.')
      console.log("ERROR CAUGHTTT", err.response.data);
      let error = err.response.data;
      if (error.error === 'mfa_required') {
        console.log("HERE");
        setMfaToken(error.mfa_token);
        promptMFA(error.mfa_token); // Access the nested structure
      } else {
        console.error("Unexpected error structure:", err);
      }
    }
    setIsLoading(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }
    handleLogin()
  }
  const promptMFA= async (accessToken) => {
    console.log("PROMPT MFA");
    const authenticators = await axios.get('https://dev-ow0gmshf.us.auth0.com/mfa/authenticators', {
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      }
    });

    console.log("RESPONSE from Authenticators", authenticators.data[4]);
    console.log('mfa TOKEN: ', mfaToken);
    let challengeResponse = await axios.post(
      '/api/auth/challenge', {
        mfa_token: mfaToken,
        authenticators: authenticators.data[4].id
      }
    )
    console.log("challengeResponse: ", challengeResponse);


     
    // let associate_response = await axios.post(
    //   'https://dev-ow0gmshf.us.auth0.com/mfa/associate',
    //   {
    //     authenticator_types: ["oob"],
    //     oob_channels: ["sms"],
    //     phone_number: '+14254355486'
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // console.log("Associate_RESPONSE: ", associate_response);
    // setAssociate(true);
  }
  const handleOtpSubmit = async () => {
    // alert(`Submitted ${otp}`);
    const response = await axios.post('/api/verify-otp', {
      mfa_token: mfaToken,
      otp,
    });
   console.log("RESPONSE.DATA: ", response.data);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8 w-full">
        {!associate ? (
          <div className="w-full max-w-md bg-white shadow-md rounded-lg">
            <div className="px-6 py-4">
              <h2 className="text-2xl font-bold text-center">Login</h2>
              <p className="text-center text-gray-500">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">

                  <span className="text-sm">{error}</span>
                </div>
              )}
              <div className="py-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
        </div>
        )
        :
        (<div> 
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
            <p className="text-center text-gray-500 mb-6">
              Please enter the 6-digit code sent to your phone.
            </p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-center text-lg"
              />
              {error && (
                <p className="text-red-600 text-center text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </div>
      </div>)
      } 
    </div>
  )
}
