'use client';

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaBolt, FaPlay, FaPause, FaTrash, FaPlus, FaFilter, FaSearch } from "react-icons/fa";

const ActionCard = ({ action, isActive, onToggle, showTrigger, variant = "default" }) => (
  <div className={`
    relative overflow-hidden rounded-2xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md group
    ${isActive 
      ? 'bg-white border-green-200 hover:border-green-300' 
      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
    }
  `}>
    {/* Status indicator */}
    <div className={`
      absolute top-0 left-0 w-full h-1
      ${isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300'}
    `} />
    
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center">
        <div className={`
          p-2 rounded-lg mr-3 transition-colors
          ${isActive 
            ? 'bg-yellow-100 text-yellow-600' 
            : 'bg-gray-200 text-gray-400'
          }
        `}>
          <FaBolt className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
            {action.name}
          </h3>
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1
            ${isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
      
      {onToggle && variant !== "binding" && (
        <button
          onClick={onToggle}
          className={`
            flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${isActive 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }
          `}
        >
          {isActive ? <FaPause className="w-3 h-3 mr-1" /> : <FaPlay className="w-3 h-3 mr-1" />}
          {isActive ? "Deactivate" : "Activate"}
        </button>
      )}
      
      {variant === "binding" && (
        <button
          onClick={onToggle}
          className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100"
        >
          <FaTrash className="w-3 h-3 mr-1" />
          Remove
        </button>
      )}
    </div>
    
    {showTrigger && (
      <div className="flex items-center text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
        <span className="font-medium mr-2">Trigger:</span>
        <code className="bg-white px-2 py-1 rounded text-xs">
          {action.supported_triggers?.[0]?.id ?? "unknown"}
        </code>
      </div>
    )}
  </div>
);

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {/* Stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
          <div className="h-1 bg-gray-200 rounded w-full mb-4"></div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("all");

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
      
      // We'll update these after getting bindings
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
      
      const bindingsData = {};
      
      for (const trigger of triggers) {
        try {
          const res = await axios.post("/api/auth/getTriggerBindings", {
            m2mToken,
            triggerId: trigger.id
          });
          bindingsData[trigger.id] = res.data.bindings || [];
        } catch (err) {
          console.error('Error fetching trigger bindings:', err);
          bindingsData[trigger.id] = [];
        }
      }
      
      setBindings(bindingsData);
      
      // Update active actions to include both deployed actions and bound actions
      updateActiveActionsWithBindings(actions, bindingsData);
      
    } catch (error) {
      console.error("Error fetching triggers:", error);
    }
  };

  // Helper function to update active actions with bound actions
  const updateActiveActionsWithBindings = (allActions, bindingsData) => {
    // Get all bound actions from triggers
    const boundActionIds = new Set();
    const boundActions = [];
    
    Object.entries(bindingsData).forEach(([triggerId, triggerBindings]) => {
      triggerBindings.forEach(binding => {
        const actionId = binding.id || binding.action_id;
        const actionName = binding.display_name || binding.action_name || binding.name;
        
        // Add to bound actions set for tracking
        boundActionIds.add(actionId);
        boundActionIds.add(actionName);
        
        boundActions.push({
          id: actionId,
          name: actionName,
          deployed: true, // Consider bound actions as active
          supported_triggers: [{ id: triggerId }],
          source: 'binding' // Flag to identify this came from bindings
        });
      });
    });

    // Get deployed actions
    const deployedActions = allActions.filter(a => a.deployed);
    
    // Get actions that are bound but not deployed
    const boundButNotDeployedActions = allActions.filter(action => 
      !action.deployed && 
      (boundActionIds.has(action.id) || boundActionIds.has(action.name))
    ).map(action => ({
      ...action,
      deployed: true, // Mark as active since it's bound
      source: 'bound_existing'
    }));

    // Combine all active actions: deployed + bound existing actions + new bound actions
    const combinedActiveActions = [
      ...deployedActions,
      ...boundButNotDeployedActions,
      ...boundActions.filter(boundAction => 
        !allActions.some(existing => 
          existing.id === boundAction.id || existing.name === boundAction.name
        )
      )
    ];

    setActiveActions(combinedActiveActions);
    
    // Update inactive actions to exclude any that are bound
    const inactiveActions = allActions.filter(action => 
      !action.deployed && 
      !boundActionIds.has(action.id) && 
      !boundActionIds.has(action.name)
    );
    setInactiveActions(inactiveActions);
    
    console.log('Active Actions Updated:', combinedActiveActions);
    console.log('Bound Action IDs:', Array.from(boundActionIds));
  };

  useEffect(() => {
    const fetchData = async () => {
      await getActions();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (actions.length > 0) {
      getActionTriggers();
    }
  }, [actions]);

  const filteredActiveActions = activeActions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInactiveActions = inactiveActions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBindings = Object.values(bindings).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Actions Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage action deployments and bind actions to triggers</p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Active Actions"
                value={activeActions.length}
                icon={<FaBolt className="w-6 h-6 text-yellow-600" />}
                color="bg-yellow-100"
              />
              <StatsCard
                title="Inactive Actions"
                value={inactiveActions.length}
                icon={<FaPause className="w-6 h-6 text-gray-600" />}
                color="bg-gray-100"
              />
              <StatsCard
                title="Total Bindings"
                value={totalBindings}
                icon={<FaPlus className="w-6 h-6 text-blue-600" />}
                color="bg-blue-100"
              />
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedTrigger}
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-w-[200px]"
                  >
                    <option value="all">All Triggers</option>
                    {triggers.map(trigger => (
                      <option key={trigger.id} value={trigger.id}>{trigger.id}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Actions - Now includes both deployed and bound actions */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Actions</h2>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredActiveActions.length} active
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActiveActions.map((action) => (
                  <ActionCard
                    key={`${action.id}-${action.source || 'deployed'}`}
                    action={action}
                    isActive={true}
                    onToggle={() => console.log('deactivate', action.id)}
                    showTrigger
                  />
                ))}
                {filteredActiveActions.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FaBolt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No active actions found</p>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </section>

            {/* Inactive Actions */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inactive Actions</h2>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredInactiveActions.length} inactive
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInactiveActions.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    isActive={false}
                    onToggle={() => console.log('activate', action.id)}
                    showTrigger
                  />
                ))}
                {filteredInactiveActions.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FaPause className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No inactive actions found</p>
                    <p className="text-gray-400">All actions are currently active</p>
                  </div>
                )}
              </div>
            </section>

            {/* Actions by Trigger */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Actions by Trigger</h2>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {triggers.length} triggers
                </div>
              </div>
              <div className="space-y-8">
                {triggers.map((trigger) => (
                  <div key={trigger.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {trigger.id}
                      </h3>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {(bindings[trigger.id] || []).length} bindings
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(bindings[trigger.id] || []).map((b) => (
                        <ActionCard
                          key={b.id || b.action_id}
                          action={{ 
                            name: b.display_name || b.action_name || b.name, 
                            supported_triggers: [{ id: trigger.id }] 
                          }}
                          isActive={true}
                          onToggle={() => console.log('remove', b.id || b.action_id)}
                          variant="binding"
                        />
                      ))}
                      {(bindings[trigger.id] || []).length === 0 && (
                        <div className="col-span-full text-center py-8">
                          <FaPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No actions bound to this trigger</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}