'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaBolt } from "react-icons/fa";

const ActionCard = ({ action, isActive, onToggle, showTrigger }) => (
  <div className="border rounded-xl p-4 shadow bg-white space-y-2">
    <div className="text-lg font-medium text-gray-800 flex items-center justify-between">
      <div className="flex items-center">
        <FaBolt className={isActive ? "text-yellow-500 mr-2" : "text-gray-400 mr-2"} />
        {action.name}
      </div>
      {onToggle && (
        <button
          onClick={onToggle}
          className="text-sm text-blue-600 hover:underline"
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      )}
    </div>
    {showTrigger && (
      <div className="text-sm text-gray-600">
        Trigger: {action.supported_triggers?.[0]?.id ?? "unknown"}
      </div>
    )}
  </div>
);

export default function ActionsPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [actions, setActions] = useState([]);
  const [activeActions, setActiveActions] = useState([]);
  const [inactiveActions, setInactiveActions] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [bindings, setBindings] = useState({});
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
      const allActions = response.data.actions || [];
      setActions(allActions);
      setActiveActions(allActions.filter(a => a.deployed));
      setInactiveActions(allActions.filter(a => !a.deployed));
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
      const triggers = response.data.triggers || [];
      setTriggers(triggers);
      triggers.forEach(async(trigger) => {
        try {
          const res = await axios.post("/api/auth/getTriggerBindings", {
            m2mToken,
            triggerId: trigger.id
          });
          setBindings(prev => ({ ...prev, [trigger.id]: res.data.bindings || [] }));
        } catch (err) {
          console.error('Error fetching trigger bindings:', err);
        }
      });
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getActions();
    getActionTriggers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-2">Actions Dashboard</h1>
      <p className="mb-6 text-gray-600">Manage action deployments and quickly bind actions to triggers.</p>

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
        <>
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-4">Active Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isActive={true}
                  onToggle={() => console.log('deactivate', action.id)}
                  showTrigger
                />
              ))}
              {activeActions.length === 0 && (
                <p className="text-gray-600 col-span-full">No active actions</p>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium mb-4">Inactive Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isActive={false}
                  onToggle={() => console.log('activate', action.id)}
                  showTrigger
                />
              ))}
              {inactiveActions.length === 0 && (
                <p className="text-gray-600 col-span-full">No inactive actions</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Active Actions by Trigger</h2>
            {triggers.map((trigger) => (
              <div key={trigger.id} className="mb-6">
                <h3 className="font-semibold mb-2">{trigger.id}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(bindings[trigger.id] || []).map((b) => (
                    <ActionCard
                      key={b.id || b.action_id}
                      action={{ name: b.display_name || b.action_name || b.name, supported_triggers: [{ id: trigger.id }] }}
                      isActive={true}
                      onToggle={() => console.log('remove', b.id || b.action_id)}
                    />
                  ))}
                  {(bindings[trigger.id] || []).length === 0 && (
                    <p className="text-gray-500 col-span-full">No actions bound</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
