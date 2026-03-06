'use client'

import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [associate, setAssociate] = useState(false);
  const [otp, setOtp] = useState('');
  const [oobCode, setOobCode] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/ROPG', { username, password });
      const data = response.data;

      if (data.access_token) {
        console.log("Login successful, access token received");
        // Login successful without MFA - store tokens and redirect
        storeTokensAndRedirect(data);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      let error = err.response.data;
      if (error.error === 'mfa_required') {
        setMfaToken(error.mfa_token);
        promptMFA(error.mfa_token);
      } else {
        setError('Login failed. Please check your credentials.');
        console.error("Unexpected error structure:", err);
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    handleLogin();
  };

  const promptMFA = async (accessToken) => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const authenticatorsResponse = await axios.get(`https://${domain}/mfa/authenticators`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    let authenticators = authenticatorsResponse.data;
    let challengeResponse = await axios.post('/api/auth/challenge', {
      mfa_token: accessToken,
      authenticators: authenticators[0].id,
    });
    setOobCode(challengeResponse.data.oob_code);
    setAssociate(true);
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        mfa_token: mfaToken,
        otp,
        oobCode,
      });
      console.log("OTP verification successful:", response.data);
      storeTokensAndRedirect(response.data);
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const storeTokensAndRedirect = (tokens) => {
    console.log("Storing tokens locally");

    // Store tokens in localStorage
    if (tokens.access_token) {
      localStorage.setItem('ropg_access_token', tokens.access_token);
    }
    if (tokens.id_token) {
      localStorage.setItem('ropg_id_token', tokens.id_token);
    }
    if (tokens.refresh_token) {
      localStorage.setItem('ropg_refresh_token', tokens.refresh_token);
    }

    // Store timestamp for token management
    localStorage.setItem('ropg_token_timestamp', new Date().toISOString());

    // Set authentication cookie for middleware
    // Cookie expires in 24 hours
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    document.cookie = `ropg_authenticated=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full" style={{ backgroundColor: 'transparent' }}>
      {!associate ? (
        <div className="w-full max-w-md shadow-md rounded-lg">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <p className="text-center text-gray-500">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block font-medium text-gray-700">
                Username
              </label>
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
              <label htmlFor="password" className="block font-medium text-gray-700">
                Password
              </label>
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
      ) : (
        <div>
          <div className="w-full max-w-md shadow-md rounded-lg p-6">
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
              {error && <p className="text-red-600 text-center text-sm">{error}</p>}
              <button
                onClick={handleOtpSubmit}
                disabled={isLoading || otp.length < 6}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
