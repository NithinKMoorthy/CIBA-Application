"use client";
import React, { useEffect, useState } from "react";
import { Key, AlertCircle, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { LoginButton } from "@/components/auth-components/login-button";

const TokenDisplayPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [myAccountAccessToken, setMyAccountAccessToken] = useState(null);
  const [myAccountTokenDetails, setMyAccountTokenDetails] = useState(null);
  const [authMethods, setAuthMethods] = useState(null);
  const [fetchingWithInitialAT, setFetchingWithInitialAT] = useState(false);
  const [fetchingWithExchangeAT, setFetchingWithExchangeAT] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    initialAT: false,
    rt: false,
    accountAT: false
  });

  useEffect(() => {
    initializeDashboard();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      let token;

      // Check if user is authenticated via ROPG
      const ropgAccessToken = localStorage.getItem('ropg_access_token');
      const ropgRefreshToken = localStorage.getItem('ropg_refresh_token');

      if (ropgAccessToken) {
        console.log('Using ROPG access token');
        token = ropgAccessToken;
        if (ropgRefreshToken) {
          setRefreshToken(ropgRefreshToken);
        }
      } else {
        // User authenticated via Universal Login - get token from session
        console.log('Getting access token from session');
        const tokenResponse = await fetch('/api/auth/token');
        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          throw new Error(tokenData.error);
        }

        token = tokenData.accessToken;
        if (tokenData.refreshToken) {
          setRefreshToken(tokenData.refreshToken);
        }
      }

      setAccessToken(token);

      // Decode token to get details
      const decoded = decodeToken(token);
      if (decoded) {
        setTokenDetails(decoded);
      }

    } catch (err) {
      console.error('Error initializing dashboard:', err);
      setError(err.message || 'Failed to initialize dashboard');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleGetAuthenticationMethods = async (useInitialAT = false) => {
    const tokenToUse = useInitialAT ? accessToken : myAccountAccessToken;

    if (!tokenToUse) {
      setError(useInitialAT
        ? 'No initial access token available.'
        : 'No My Account API access token available. Click "Get My Account AT" first.');
      return;
    }

    try {
      // Set appropriate loading state
      if (useInitialAT) {
        setFetchingWithInitialAT(true);
      } else {
        setFetchingWithExchangeAT(true);
      }
      setError(null);

      console.log(`Calling /api/auth/myaccount/authentication-methods with ${useInitialAT ? 'Initial' : 'My Account API'} AT...`);

      const response = await fetch('/api/auth/myaccount/authentication-methods', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));

      if (data.error || !response.ok) {
        throw new Error(data.error || data.error_description || 'Failed to fetch authentication methods');
      }

      console.log('✅ Authentication Methods received!');
      console.log('Authentication Methods:', data);

      // Handle different response structures
      let methodsArray = data;

      // If data is an object with a data property, extract it
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        console.log('Data is an object, checking for array properties...');
        console.log('Object keys:', Object.keys(data));

        // Check common property names
        if (Array.isArray(data.data)) {
          methodsArray = data.data;
          console.log('Found array in data.data property');
        } else if (Array.isArray(data.authentication_methods)) {
          methodsArray = data.authentication_methods;
          console.log('Found array in data.authentication_methods property');
        } else if (Array.isArray(data.methods)) {
          methodsArray = data.methods;
          console.log('Found array in data.methods property');
        } else {
          // If it's a single object that looks like a method, wrap it in an array
          if (data.id || data.type) {
            methodsArray = [data];
            console.log('Single method object detected, wrapping in array');
          }
        }
      }

      console.log('Final methodsArray:', methodsArray);
      console.log('Final methodsArray is array:', Array.isArray(methodsArray));
      console.log('Final methodsArray length:', Array.isArray(methodsArray) ? methodsArray.length : 'N/A');

      setAuthMethods(methodsArray);
      showSuccessMessage(`Authentication methods fetched successfully using ${useInitialAT ? 'Initial AT' : 'My Account API AT'}!`);

    } catch (err) {
      console.error('Error fetching authentication methods:', err);
      setError(`Failed to fetch authentication methods: ${err.message}`);
      setAuthMethods(null);
    } finally {
      // Clear appropriate loading state
      if (useInitialAT) {
        setFetchingWithInitialAT(false);
      } else {
        setFetchingWithExchangeAT(false);
      }
    }
  };

  const handleGetMyAccountAccessToken = async () => {
    if (!refreshToken) {
      setError('No refresh token available');
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      console.log('Calling /api/auth/myaccount/get-access-token with refresh token...');

      const response = await fetch('/api/auth/myaccount/get-access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error_description || data.error);
      }

      console.log('✅ My Account API Access Token received!');
      console.log('Full Response:', data);
      console.log('Access Token:', data.access_token);
      console.log('Scopes (from response.scope):', data.scope);
      console.log('Token Type:', data.token_type);
      console.log('Expires In:', data.expires_in, 'seconds');

      // Decode token to check scopes in JWT
      const decoded = decodeToken(data.access_token);
      console.log('Decoded Token:', decoded);
      if (decoded) {
        console.log('Scopes in JWT (scope field):', decoded.scope);
        console.log('Scopes in JWT (scp field):', decoded.scp);
        console.log('Permissions in JWT:', decoded.permissions);
      }

      // Store the My Account API access token separately
      const newAccessToken = data.access_token;
      setMyAccountAccessToken(newAccessToken);

      // Decode My Account API token
      const newDecoded = decodeToken(newAccessToken);
      if (newDecoded) {
        setMyAccountTokenDetails(newDecoded);
      }

      // Update refresh token if a new one was issued
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        // Update localStorage if using ROPG
        if (localStorage.getItem('ropg_refresh_token')) {
          localStorage.setItem('ropg_refresh_token', data.refresh_token);
        }
      }

      showSuccessMessage('My Account API Access Token obtained successfully! Check console for details.');

      // Auto-expand the Account AT section
      setExpandedSections(prev => ({ ...prev, accountAT: true }));

    } catch (err) {
      console.error('Error getting My Account access token:', err);
      setError(`Failed to get My Account access token: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <LoginButton />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account API Token Display</h1>
          <p className="text-gray-600">View and manage your access tokens and retrieve authentication methods</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Main Action Button */}
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Get My Account API Access Token</h2>
              <p className="text-sm text-gray-500 mt-1">Exchange your refresh token for an access token with all My Account API scopes</p>
            </div>
            {refreshToken && (
              <button
                onClick={handleGetMyAccountAccessToken}
                disabled={refreshing}
                className="flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                <Key className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Getting Token...' : 'Get My Account AT'}
              </button>
            )}
          </div>
        </div>

        {/* Tokens Display - Expandable Sections */}
        <div className="space-y-4 mb-6">
          {/* Initial Access Token */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('initialAT')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Key className="w-5 h-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Initial Access Token (AT)</h3>
                  <p className="text-sm text-gray-500">Your original access token from login</p>
                </div>
                <div className={`ml-4 w-2 h-2 rounded-full ${accessToken ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              {expandedSections.initialAT ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {expandedSections.initialAT && accessToken && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Token Value</label>
                    <div className="bg-white p-3 rounded border border-gray-300">
                      <p className="text-xs font-mono text-gray-800 break-all">{accessToken}</p>
                    </div>
                  </div>
                  {tokenDetails && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <span className="text-gray-600">Audience:</span>
                          <p className="font-mono text-gray-900 break-all mt-1">{Array.isArray(tokenDetails.aud) ? tokenDetails.aud.join(', ') : tokenDetails.aud}</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <span className="text-gray-600">Expires:</span>
                          <p className="text-gray-900 mt-1">{formatDate(tokenDetails.exp)}</p>
                        </div>
                      </div>
                      {(tokenDetails.scope || tokenDetails.scp) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Scopes</label>
                          <div className="flex flex-wrap gap-1">
                            {(tokenDetails.scope || tokenDetails.scp || '').split(' ').filter(Boolean).map((scope, idx) => (
                              <span key={idx} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Token */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('rt')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <RefreshCw className="w-5 h-5 text-green-600 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Refresh Token (RT)</h3>
                  <p className="text-sm text-gray-500">Used to obtain new access tokens</p>
                </div>
                <div className={`ml-4 w-2 h-2 rounded-full ${refreshToken ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              {expandedSections.rt ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {expandedSections.rt && refreshToken && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Token Value</label>
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <p className="text-xs font-mono text-gray-800 break-all">{refreshToken}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* My Account API Access Token */}
          {myAccountAccessToken && (
            <div className="bg-white rounded-lg shadow-md border-2 border-purple-500 overflow-hidden">
              <button
                onClick={() => toggleSection('accountAT')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center">
                  <Key className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">My Account API Access Token</h3>
                    <p className="text-sm text-gray-500">Token with My Account API scopes</p>
                  </div>
                  <div className="ml-4 w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                {expandedSections.accountAT ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {expandedSections.accountAT && (
                <div className="p-4 border-t border-purple-200 bg-purple-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Token Value</label>
                      <div className="bg-white p-3 rounded border border-purple-300">
                        <p className="text-xs font-mono text-gray-800 break-all">{myAccountAccessToken}</p>
                      </div>
                    </div>
                    {myAccountTokenDetails && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-purple-100 p-2 rounded text-xs">
                            <span className="text-gray-600">Audience:</span>
                            <p className="font-mono text-gray-900 break-all mt-1">{Array.isArray(myAccountTokenDetails.aud) ? myAccountTokenDetails.aud.join(', ') : myAccountTokenDetails.aud}</p>
                          </div>
                          <div className="bg-purple-100 p-2 rounded text-xs">
                            <span className="text-gray-600">Expires:</span>
                            <p className="text-gray-900 mt-1">{formatDate(myAccountTokenDetails.exp)}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Scopes/Permissions</label>
                          {(myAccountTokenDetails.scope || myAccountTokenDetails.scp || myAccountTokenDetails.permissions) ? (
                            <div className="flex flex-wrap gap-1">
                              {(myAccountTokenDetails.scope || myAccountTokenDetails.scp || myAccountTokenDetails.permissions || '').split(' ').filter(Boolean).map((scope, idx) => (
                                <span key={idx} className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                  {scope}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 p-2 rounded border border-yellow-300 text-xs">
                              <p className="text-yellow-800">⚠️ No scopes found. Check server logs.</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Retrieve Authentication Methods */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Retrieve Authentication Methods</h2>
          <p className="text-sm text-gray-600 mb-4">Choose which access token to use for retrieving authentication methods</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleGetAuthenticationMethods(true)}
              disabled={!accessToken || fetchingWithInitialAT}
              className="flex flex-col items-center justify-center p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Key className={`w-8 h-8 mb-2 ${fetchingWithInitialAT ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-lg">
                {fetchingWithInitialAT ? 'Fetching...' : 'Retrieve with Initial AT'}
              </span>
              <span className="text-xs mt-1 opacity-90">Uses your original access token</span>
            </button>

            <button
              onClick={() => handleGetAuthenticationMethods(false)}
              disabled={!myAccountAccessToken || fetchingWithExchangeAT}
              className="flex flex-col items-center justify-center p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Key className={`w-8 h-8 mb-2 ${fetchingWithExchangeAT ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-lg">
                {fetchingWithExchangeAT ? 'Fetching...' : 'Retrieve with AT Exchange'}
              </span>
              <span className="text-xs mt-1 opacity-90">Uses My Account API access token</span>
            </button>
          </div>
        </div>

        {/* Authentication Methods Results */}
        {authMethods && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Authentication Methods</h2>
                <p className="text-sm text-gray-500 mt-1">User's enrolled authentication methods</p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">{Array.isArray(authMethods) ? authMethods.length : 'N/A'}</span> Methods
              </div>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-semibold text-yellow-800 mb-1">Debug Info:</p>
              <p className="text-yellow-700">Type: {typeof authMethods}</p>
              <p className="text-yellow-700">Is Array: {Array.isArray(authMethods) ? 'Yes' : 'No'}</p>
              {Array.isArray(authMethods) && <p className="text-yellow-700">Length: {authMethods.length}</p>}
              {!Array.isArray(authMethods) && typeof authMethods === 'object' && (
                <p className="text-yellow-700">Object Keys: {Object.keys(authMethods).join(', ')}</p>
              )}
            </div>

            {Array.isArray(authMethods) && authMethods.length > 0 ? (
              <div className="space-y-4">
                {authMethods.map((method, index) => (
                  <div key={method.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Method ID</p>
                        <p className="text-sm font-mono text-gray-900 break-all">{method.id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="text-sm font-semibold text-indigo-600">{method.type || 'N/A'}</p>
                      </div>
                      {method.name && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Name</p>
                          <p className="text-sm text-gray-900">{method.name}</p>
                        </div>
                      )}
                      {method.created_at && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Created At</p>
                          <p className="text-sm text-gray-900">{new Date(method.created_at).toLocaleString()}</p>
                        </div>
                      )}
                      {method.last_auth_at && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Used</p>
                          <p className="text-sm text-gray-900">{new Date(method.last_auth_at).toLocaleString()}</p>
                        </div>
                      )}
                      {method.authentication_methods && Array.isArray(method.authentication_methods) && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Authentication Methods</p>
                          <div className="flex flex-wrap gap-1">
                            {method.authentication_methods.map((am, idx) => (
                              <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Raw JSON for debugging */}
                    <details className="mt-3">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View Raw JSON
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                        {JSON.stringify(method, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded border border-gray-200 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No authentication methods found</p>
                <p className="text-sm text-gray-500 mt-1">This user has no enrolled authentication methods</p>
              </div>
            )}

            {/* Raw API Response */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <details>
                <summary className="text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">
                  View Complete API Response
                </summary>
                <pre className="mt-3 text-xs bg-gray-800 text-green-400 p-4 rounded overflow-x-auto max-h-96">
                  {JSON.stringify(authMethods, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDisplayPage;
