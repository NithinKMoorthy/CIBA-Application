"use client";
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const TokenDisplay = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [decodedIdToken, setDecodedIdToken] = useState<any>(null);
  const [tokenSource, setTokenSource] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'id' | 'access' | 'refresh'>('id');
  const [copiedField, setCopiedField] = useState<string>('');

  // Check localStorage for ROPG tokens first, then fall back to session tokens
  const getToken = async () => {
    try {
      const ropgAccessToken = localStorage.getItem('ropg_access_token');
      const ropgIdToken = localStorage.getItem('ropg_id_token');
      const ropgRefreshToken = localStorage.getItem('ropg_refresh_token');

      if (ropgAccessToken || ropgIdToken) {
        console.log("Using ROPG tokens from localStorage");
        setAccessToken(ropgAccessToken);
        setRefreshToken(ropgRefreshToken);
        setIdToken(ropgIdToken);
        setTokenSource("ROPG (Local Storage)");

        if (ropgIdToken) {
          const decoded = jwtDecode(ropgIdToken);
          setDecodedIdToken(decoded);
        }
      } else {
        console.log("Fetching tokens from session");
        const response = await fetch("/api/auth/token", {
          method: "GET",
        });
        const data = await response.json();
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setIdToken(data.idToken);
        setTokenSource("Universal Login (Session)");

        if (data.idToken) {
          const decoded = jwtDecode(data.idToken);
          setDecodedIdToken(decoded);
        }
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const clearLocalTokens = () => {
    localStorage.removeItem('ropg_access_token');
    localStorage.removeItem('ropg_id_token');
    localStorage.removeItem('ropg_refresh_token');
    localStorage.removeItem('ropg_token_timestamp');
    document.cookie = 'ropg_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
    >
      {copiedField === field ? (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </span>
      ) : (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Tokens</h1>
          <p className="text-gray-600">View and manage your authentication tokens</p>
        </div>

        {/* Token Source Badge */}
        {tokenSource && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${tokenSource.includes('ROPG') ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Token Source</p>
                  <p className="text-sm text-gray-500">{tokenSource}</p>
                </div>
              </div>
              {tokenSource.includes('ROPG') && (
                <button
                  onClick={clearLocalTokens}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear ROPG Tokens
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('id')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'id'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  ID Token
                </div>
              </button>
              <button
                onClick={() => setActiveTab('access')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'access'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Access Token
                </div>
              </button>
              <button
                onClick={() => setActiveTab('refresh')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'refresh'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Token
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* ID Token Tab */}
          {activeTab === 'id' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Encoded Token */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Encoded ID Token</h3>
                  {idToken && <CopyButton text={idToken} field="idToken" />}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <code className="text-xs text-gray-700 break-all font-mono leading-relaxed">
                    {idToken || "Loading..."}
                  </code>
                </div>
              </div>

              {/* Decoded Payload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Decoded Payload</h3>
                  {decodedIdToken && <CopyButton text={JSON.stringify(decodedIdToken, null, 2)} field="decodedPayload" />}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-auto">
                  <pre className="text-xs text-gray-700 font-mono">
                    {decodedIdToken ? JSON.stringify(decodedIdToken, null, 2) : "Loading..."}
                  </pre>
                </div>
              </div>

              {/* Decoded Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Decoded Header</h3>
                  {decodedIdToken && (
                    <CopyButton
                      text={JSON.stringify({
                        alg: "RS256",
                        typ: "JWT",
                        kid: decodedIdToken?.kid || "w6r91UW9vXqnuvsz5OgSM"
                      }, null, 2)}
                      field="decodedHeader"
                    />
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="text-xs text-gray-700 font-mono">
                    {JSON.stringify(
                      {
                        alg: "RS256",
                        typ: "JWT",
                        kid: decodedIdToken?.kid || "w6r91UW9vXqnuvsz5OgSM"
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Access Token Tab */}
          {activeTab === 'access' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Access Token</h3>
                {accessToken && <CopyButton text={accessToken} field="accessToken" />}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <code className="text-xs text-gray-700 break-all font-mono leading-relaxed">
                  {accessToken || "Loading..."}
                </code>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Access tokens are used to authenticate API requests. Keep them secure and never share them publicly.
                </p>
              </div>
            </div>
          )}

          {/* Refresh Token Tab */}
          {activeTab === 'refresh' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Refresh Token</h3>
                {refreshToken && <CopyButton text={refreshToken} field="refreshToken" />}
              </div>
              {refreshToken ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <code className="text-xs text-gray-700 break-all font-mono leading-relaxed">
                      {refreshToken}
                    </code>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Available:</strong> This refresh token can be used to obtain new access tokens without requiring the user to log in again.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Refresh Token Available</h3>
                  <p className="text-sm text-gray-500">
                    Refresh tokens are only available when the <code className="px-2 py-1 bg-gray-100 rounded">offline_access</code> scope is requested during authentication.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;
