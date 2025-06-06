"use client";
import { RefreshCw, Settings, FileCode } from 'lucide-react';

const DashboardHeader = ({ getRealAuthenticators, isRefreshing, config }) => {
  const {
    showConfig,
    setShowConfig,
    useCustomTickets,
    setUseCustomTickets,
    useEmbedded,
    setUseEmbedded
  } = config;
  
  const formsRedirect = () => {
    window.location.href = '/api/auth/forms';
  };
  
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Methods</h1>
          <p className="text-gray-600">
            Manage your account security and authentication preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => getRealAuthenticators(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Settings className="w-4 h-4" />
            Configure
          </button>
          <button
            onClick={() => formsRedirect()}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <FileCode className="w-4 h-4" />
            Use Forms
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <Toggle label="Use Custom Enrollment Tickets" checked={useCustomTickets} onChange={() => setUseCustomTickets(!useCustomTickets)} />
          <Toggle label="Use Embedded Authentication" checked={useEmbedded} onChange={() => setUseEmbedded(!useEmbedded)} />
        </div>
      )}
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-800">{label}</span>
    <div
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </div>
  </div>
);

export default DashboardHeader;
