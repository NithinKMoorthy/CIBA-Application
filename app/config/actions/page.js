'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaBolt, FaEdit, FaRocket, FaSave, FaTimes, FaLink, FaCheckCircle } from "react-icons/fa";

export default function ActionsPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggers, setTriggers] = useState([]);
  const [triggerBindings, setTriggerBindings] = useState({});
  const [editingAction, setEditingAction] = useState(null);
  const [editedCode, setEditedCode] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      const fetchedTriggers = response.data.triggers || [];
      setTriggers(fetchedTriggers);

      // Fetch bindings for each trigger
      await getTriggerBindings(m2mToken, fetchedTriggers);
    } catch (error) {
      console.error("Error fetching triggers:", error);
    }
  }

  const getTriggerBindings = async (m2mToken, triggersList) => {
    try {
      console.log("Getting Trigger Bindings");
      const bindingsMap = {};

      // Fetch bindings for each trigger
      for (const trigger of triggersList) {
        try {
          const response = await axios.post("/api/auth/getTriggerBindings", {
            m2mToken,
            triggerId: trigger.id
          });
          bindingsMap[trigger.id] = response.data.bindings || [];
        } catch (error) {
          console.error(`Error fetching bindings for trigger ${trigger.id}:`, error);
          bindingsMap[trigger.id] = [];
        }
      }

      console.log("Bindings Map:", bindingsMap);
      setTriggerBindings(bindingsMap);
    } catch (error) {
      console.error("Error fetching trigger bindings:", error);
    }
  }

  const handleEdit = (action) => {
    setEditingAction(action);
    setEditedCode(action.code || '');
    setSelectedTrigger(action.supported_triggers?.[0]?.id || '');
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const m2mToken = await getM2MToken();
      await axios.post("/api/auth/updateAction", {
        m2mToken,
        actionId: editingAction.id,
        code: editedCode,
        name: editingAction.name
      });
      setMessage({ type: 'success', text: 'Action updated successfully!' });
      await getActions();
    } catch (error) {
      console.error("Error updating action:", error);
      setMessage({ type: 'error', text: 'Failed to update action' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      const m2mToken = await getM2MToken();
      await axios.post("/api/auth/deployAction", {
        m2mToken,
        actionId: editingAction.id,
        triggerId: selectedTrigger
      });
      setMessage({ type: 'success', text: 'Action deployed successfully!' });
      setEditingAction(null);
      await getActions();
      await getTriggerBindings(m2mToken, triggers);
    } catch (error) {
      console.error("Error deploying action:", error);
      setMessage({ type: 'error', text: 'Failed to deploy action' });
    } finally {
      setDeploying(false);
    }
  };

  const closeModal = () => {
    setEditingAction(null);
    setEditedCode('');
    setSelectedTrigger('');
    setMessage({ type: '', text: '' });
  };

  useEffect(() => {
    getActions();
    getActionTriggers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Post-Login Actions</h1>

      {/* Currently Deployed Actions Section */}
      {!loading && Object.keys(triggerBindings).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            Currently Deployed Actions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {triggers.map((trigger) => {
              const bindings = triggerBindings[trigger.id] || [];
              return (
                <div
                  key={trigger.id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FaLink className="text-blue-500 mr-2" />
                      <h3 className="font-semibold text-gray-800">{trigger.id}</h3>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {trigger.version}
                    </span>
                  </div>

                  {bindings.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No actions deployed</p>
                  ) : (
                    <div className="space-y-2">
                      {bindings.map((binding, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center">
                            <FaBolt className="text-yellow-500 mr-2 text-sm" />
                            <span className="text-sm font-medium text-gray-700">
                              {binding.display_name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {binding.ref?.value?.substring(0, 8)}...
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">All Actions</h2>

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
          {actions.map((action) => {
            // Check if this action is deployed to any trigger
            const deployedTriggers = Object.entries(triggerBindings)
              .filter(([triggerId, bindings]) =>
                bindings.some(binding => binding.ref?.value === action.id)
              )
              .map(([triggerId]) => triggerId);

            const isDeployed = deployedTriggers.length > 0;

            return (
              <div
                key={action.id}
                className="border rounded-xl p-4 shadow-sm bg-white space-y-2 relative"
              >
                <div className="text-lg font-medium text-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBolt className="text-yellow-500 mr-2" />
                    {action.name}
                    {isDeployed && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                        <FaCheckCircle className="mr-1" size={10} />
                        Deployed
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(action)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit Action"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Trigger: {action.supported_triggers?.[0]?.id ?? "unknown"}
                </div>
                {isDeployed && (
                  <div className="text-xs text-green-600 flex items-center">
                    <FaLink className="mr-1" size={10} />
                    Active on: {deployedTriggers.join(', ')}
                  </div>
                )}
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
            );
          })}
        </div>
      )}

      {editingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <FaEdit className="mr-2 text-blue-600" />
                Edit Action: {editingAction.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {message.text && (
                <div className={`mb-4 p-3 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Code
                </label>
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter action code..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deploy to Trigger
                </label>
                <select
                  value={selectedTrigger}
                  onChange={(e) => setSelectedTrigger(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a trigger</option>
                  {triggers.map((trigger) => (
                    <option key={trigger.id} value={trigger.id}>
                      {trigger.id} - {trigger.version}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSave />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleDeploy}
                disabled={deploying || !selectedTrigger}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaRocket />
                {deploying ? 'Deploying...' : 'Deploy to Trigger'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
