'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaBolt } from "react-icons/fa";

export default function ActionsPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getM2MToken = async () => {
    const response = await axios.get("/api/auth/m2m");
    return response.data.accessToken;
  };

  const getActions = async () => {
    try {
      console.log("Getting Actions");
      const m2mToken = await getM2MToken();
      const response = await axios.post("/api/auth/getActions", {
        m2mToken
      });
      console.log("Response.data:" , response.data);
      setActions(response.data.actions || []);
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setLoading(false);
    }
  };
  const getActionTriggers = async() => {
    try {
      console.log("Getting Triggers");
      const m2mToken = await getM2MToken();
      const response = await axios.post("/api/auth/getActionTriggers", {
        m2mToken
      });
      console.log("Response.data for Triggers:" , response.data);
      sortTriggers(response.data.triggers);
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const sortTriggers = async(triggers) => {
      let triggerIdArray = triggers.map(trigger => trigger.id);
      console.log("TriggerIdArray", triggerIdArray);
      const triggerSet = new Set(triggerIdArray);
      console.log("Trigger Set: ", triggerSet);
  }

  useEffect(() => {
    getActions();
    getActionTriggers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Post-Login Actions</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 shadow-sm bg-white animate-pulse h-28"
            >
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="border rounded-xl p-4 shadow-sm bg-white space-y-2"
            >
              <div className="text-lg font-medium text-gray-800 flex items-center">
                <FaBolt className="text-yellow-500 mr-2" />
                {action.name}
              </div>
              <div className="text-sm text-gray-600">
                Trigger: {action.supported_triggers?.[0]?.id ?? "unknown"}
              </div>
              <div className="text-xs text-gray-400">
                Created: {new Date(action.created_at).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                Updated: {new Date(action.updated_at).toLocaleString()}
              </div>
              <div className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                {action.code?.slice(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
