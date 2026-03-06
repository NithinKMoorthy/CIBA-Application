"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Shield, Smartphone, Key, Mail, Fingerprint, RefreshCw, Plus,
  Edit, Trash2, ChevronDown, ChevronUp, CheckCircle, AlertCircle
} from 'lucide-react';
import DashboardHeader from "./DashboardHeader";
import axios from 'axios'; 

const factorDescriptions = {
  phone: { name: "Phone", type: "Two-Factor", description: "Receive verification codes via text message.", icon: Smartphone, color: "blue" },
  "push-notification": { name: "Push Notification", type: "Adaptive", description: "Approve login attempts via push.", icon: Smartphone, color: "purple" },
  otp: { name: "Authenticator App", type: "Two-Factor", description: "Generate time-based codes with Authy, etc.", icon: Shield, color: "green" },
  email: { name: "Email Verification", type: "Two-Factor", description: "Receive codes via email.", icon: Mail, color: "orange" },
  duo: { name: "Duo Security", type: "Third-Party", description: "Enterprise-grade Duo MFA.", icon: Shield, color: "indigo" },
  "webauthn-roaming": { name: "Hardware Key", type: "Advanced", description: "Use a security key like YubiKey.", icon: Key, color: "red" },
  "webauthn-platform": { name: "Biometrics", type: "Advanced", description: "Built-in biometrics like Touch ID.", icon: Fingerprint, color: "pink" },
  "recovery-code": { name: "Recovery Codes", type: "Backup", description: "Use one-time backup codes.", icon: Key, color: "gray" },
};

const AuthenticatorDashboard = () => {
  const { user } = useUser();
  const [authenticators, setAuthenticators] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Config state
  const [showConfig, setShowConfig] = useState(false);
  const [useCustomTickets, setUseCustomTickets] = useState(false);
  const [useEmbedded, setUseEmbedded] = useState(false);

  const config = {
    showConfig,
    setShowConfig,
    useCustomTickets,
    setUseCustomTickets,
    useEmbedded,
    setUseEmbedded
  };

  const getM2MToken = async () => {
    const res = await fetch('/api/auth/m2m');
    const data = await res.json();
    return data.accessToken;
  };

  const toggleExpanded = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const timeoutRef = useRef(null);

  const showMessage = (text, type) => {
    let timeout = type === 'link' ? 15000 : 2000;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setMessage({ text, type });
    timeoutRef.current = setTimeout(() => {
      setMessage({ text: '', type: '' });
      timeoutRef.current = null;
    }, timeout);
  };

  const getRealAuthenticators = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      setIsLoading(true);

      const token = await getM2MToken();
      const [tenantRes, userRes] = await Promise.all([
        fetch('/api/auth/getTenantFactors', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ m2mToken: token })
        }).then(res => res.json()),
        fetch('/api/auth/getAuthenticators', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.sub })
        }).then(res => res.json())
      ]);

      // Check for API errors
      if (tenantRes.error) {
        throw new Error(tenantRes.error);
      }
      if (userRes.error) {
        throw new Error(userRes.error);
      }

      const tenantFactors = tenantRes.ticket_url || tenantRes;
      const enabledFactors = Array.isArray(tenantFactors) ? tenantFactors.filter(f => f.enabled) : [];

      const mapped = enabledFactors.map(factor => {
        const userFactors = Array.isArray(userRes) ? userRes.filter(
          a => a.preferred_authentication_method === factor.name || a.type === factor.name
        ) : [];
        const meta = factorDescriptions[factor.name] || {
          name: factor.name,
          type: "Unknown",
          description: "No info",
          icon: Shield,
          color: "gray"
        };
        return {
          id: factor.name,
          ...meta,
          status: userFactors.length ? "Active" : "Available",
          lastUpdated: userFactors[0]?.last_auth_at || null,
          userFactors,
          enrolledCount: userFactors.length
        };
      });

      setAuthenticators(mapped);
      if (showRefresh) showMessage('Refreshed successfully', 'success');
    } catch (e) {
      console.error(e);
      showMessage('Failed to fetch data', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.sub) getRealAuthenticators();
  }, [user]);

  const handleAdd = async (id) => {
    showMessage(`Setting up ${factorDescriptions[id]?.name || id}...`, 'info');

    if (!useCustomTickets) {
      showMessage(`Standard flow for ${id} not implemented.`, 'info');
      return;
    }

    const token = await getM2MToken();
    const response = await axios.post('/api/auth/generateCustomEnrollmentTicket', {
      m2mToken: token,
      userId: user.sub,
      type: id
    });

    showMessage(`${response.data.ticket_url}`, 'link');
  };

  const handleEdit = (id) => showMessage(`Editing ${factorDescriptions[id]?.name || id}...`, 'info');
  const handleDelete = (id) => showMessage(`Removing ${factorDescriptions[id]?.name || id}...`, 'warning');

  const formatDate = (str) => !str ? 'Never' : new Date(str).toLocaleString();
  const getStatusIcon = (status) => status === 'Active' ? CheckCircle : AlertCircle;
  const getStatusColor = (status) => status === 'Active' ? 'text-emerald-600' : 'text-amber-600';
  const getColorClasses = (c) => {
    const m = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return m[c] || m.gray;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto ">
        <DashboardHeader
          getRealAuthenticators={getRealAuthenticators}
          isRefreshing={isRefreshing}
          config={config}
        />

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            message.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {message.type === 'link' ? (
              <span>
                Custom Enrollment Ticket:{" "}
                <a href={message.text} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900">
                  {message.text}
                </a>
              </span>
            ) : (
              message.text
            )}
          </div>
        )}

        <div className="grid gap-6">
          {authenticators.map(auth => {
            const Icon = auth.icon;
            const StatusIcon = getStatusIcon(auth.status);
            const isExpanded = expandedIds.includes(auth.id);

            return (
              <div key={auth.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md">
                <div className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg border ${getColorClasses(auth.color)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{auth.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{auth.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(auth.status)}`} />
                            {auth.status}
                          </div>
                          <span>Enrolled: {auth.enrolledCount}</span>
                          {auth.lastUpdated && <span>Last used: {formatDate(auth.lastUpdated)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button onClick={() => handleAdd(auth.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        <Plus className="w-4 h-4 inline-block mr-1" />Add
                      </button>
                      {auth.userFactors.length > 0 && (
                        <button onClick={() => toggleExpanded(auth.id)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                          {isExpanded ? <ChevronUp className="w-4 h-4 inline-block mr-1" /> : <ChevronDown className="w-4 h-4 inline-block mr-1" />}
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && auth.userFactors.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-md font-semibold mb-4">Enrolled Authenticators</h4>
                      <div className="space-y-4">
                        {auth.userFactors.map((factor, i) => (
                          <div key={factor.id || i} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div><strong>Type:</strong> {factor.type}</div>
                              <div><strong>Created:</strong> {formatDate(factor.created_at)}</div>
                              <div><strong>Last Used:</strong> {formatDate(factor.last_auth_at)}</div>
                              {factor.phone_number && <div><strong>Phone:</strong> {factor.phone_number}</div>}
                            </div>
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => handleEdit(factor.id || factor.type)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700">
                                <Edit className="w-4 h-4 inline-block mr-1" />Edit
                              </button>
                              <button onClick={() => handleDelete(factor.id || factor.type)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                                <Trash2 className="w-4 h-4 inline-block mr-1" />Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatorDashboard;
