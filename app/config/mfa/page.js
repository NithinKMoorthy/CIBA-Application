'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import { FaShieldAlt, FaBolt, FaUsers } from "react-icons/fa";
import axios from "axios";

export default function MfaPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [factors, setFactors] = useState([]);
  const [updatingFactor, setUpdatingFactor] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [updatingPolicy, setUpdatingPolicy] = useState(null);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  const getM2MToken = async () => {
    const response = await axios.get("/api/auth/m2m");
    return response.data.accessToken;
  };

  useEffect(() => {
    console.log("Policies Update", policies);
  }, [policies])
  const getTenantFactors = async () => {
    try {
      const token = await getM2MToken();
      const response = await axios.post("/api/auth/getTenantFactors", {
        m2mToken: token,
      });
      setFactors(response.data.ticket_url || []);
    } catch (error) {
      console.error("Error fetching tenant factors:", error);
    } finally {
      setLoadingFactors(false);
    }
  };

  const getTenantPolicies = async () => {
    try {
      const token = await getM2MToken();
      const response = await axios.post("/api/auth/getPolicies", {
        m2mToken: token,
      });
      console.log("response.data for policies: ", response.data);
      let policies = response.data.ticket_url[0];
      console.log("POLICIES: ", policies);
      setPolicies(policies || []);
    } catch (error) {
      console.error("Error fetching tenant policies:", error);
    } finally {
      setLoadingPolicies(false);
    }
  };

  const updateTenantFactor = async (name, enabled) => {
    setUpdatingFactor(name);
    try {
      const token = await getM2MToken();
      await axios.put("/api/auth/updateFactor", {
        m2mToken: token,
        name,
        enabled,
      });
      getTenantFactors();
    } catch (err) {
      console.error("Error updating factor:", err);
    } finally {
      setUpdatingFactor(null);
    }
  };

  const handlePolicyToggle = async (policy) => {
    setUpdatingPolicy(policy);
    try {
      const token = await getM2MToken();
      await axios.put("/api/auth/updatePolicy", {
        m2mToken: token,
        policy,
        enabled: true,
      });
      setPolicies(policy === "never" ? [] : [policy]);
    } catch (err) {
      console.error("Error updating policy:", err);
    } finally {
      setUpdatingPolicy(null);
    }
  };

  useEffect(() => {
    getTenantFactors();
    getTenantPolicies();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">MFA Configuration</h1>

      <h2 className="text-xl font-medium mb-4">Tenant Factors Enabled</h2>

      {loadingFactors ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 shadow-sm bg-white animate-pulse h-16"
            >
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((factor) => (
            <div
              key={factor.name}
              className="border rounded-xl p-4 shadow-sm bg-white flex items-center justify-between"
            >
              <div className="capitalize text-gray-800">
                {factor.name.replace(/-/g, " ")}
                {factor.trial_expired && (
                  <span className="ml-2 text-sm text-red-500">
                    (Trial Expired)
                  </span>
                )}
              </div>
              {updatingFactor === factor.name ? (
                <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
              ) : (
                <input
                  type="checkbox"
                  checked={factor.enabled}
                  onChange={(e) => updateTenantFactor(factor.name, e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-medium mb-4">MFA Policy: {policies}</h2>
        {loadingPolicies ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 shadow-sm bg-white animate-pulse h-16"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["never", "all-applications", "confidence-score"].map((policy) => (
              <div
                key={policy}
                className="border rounded-xl p-4 shadow-sm bg-white flex items-center justify-between"
              >
          
                <div className="capitalize text-gray-800">
                  {policy.replace(/-/g, " ")}
                </div>
                <input
                  type="radio"
                  name="mfa-policy"
                  checked={policies.length === 0 ? policy === 'never' : policies.includes(policy)}
                  disabled={updatingPolicy === policy}
                  onChange={() => handlePolicyToggle(policy)}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
