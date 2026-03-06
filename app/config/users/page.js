'use client';
import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  FaUsers,
  FaSearch,
  FaUserShield,
  FaBuilding,
  FaEllipsisV,
  FaTimes,
  FaUserPlus,
  FaUserMinus,
  FaSync,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

export default function UsersPage() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  const getM2MToken = async () => {
    const response = await axios.get("/api/auth/m2m");
    return response.data.accessToken;
  };

  const getUsers = async (search = '') => {
    try {
      setLoading(true);
      const m2mToken = await getM2MToken();
      const response = await axios.post("/api/auth/getUsers", {
        m2mToken,
        search,
        perPage: 50
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const getOrganizations = async () => {
    try {
      const m2mToken = await getM2MToken();
      const response = await axios.post("/api/auth/getOrganizations", {
        m2mToken
      });
      setOrganizations(response.data.organizations || response.data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const getUserOrganizations = async (userId) => {
    try {
      const m2mToken = await getM2MToken();
      const response = await axios.post("/api/auth/getUserOrganizations", {
        m2mToken,
        userId
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      return [];
    }
  };

  const handleResetFactors = async (userId) => {
    if (!confirm('Are you sure you want to reset MFA factors for this user?')) {
      return;
    }

    try {
      setProcessing(true);
      const m2mToken = await getM2MToken();
      await axios.post("/api/auth/resetUserFactors", {
        m2mToken,
        userId
      });
      setMessage({ type: 'success', text: 'MFA factors reset successfully' });
      setActionMenuOpen(null);
    } catch (error) {
      console.error("Error resetting factors:", error);
      setMessage({ type: 'error', text: 'Failed to reset MFA factors' });
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToOrg = async (userId) => {
    const orgs = await getUserOrganizations(userId);
    setUserOrganizations(orgs);
    setSelectedUser(userId);
    setShowOrgModal(true);
    setActionMenuOpen(null);
  };

  const handleAddUserToOrganization = async (organizationId) => {
    try {
      setProcessing(true);
      const m2mToken = await getM2MToken();
      await axios.post("/api/auth/addUserToOrganization", {
        m2mToken,
        organizationId,
        userId: selectedUser
      });
      setMessage({ type: 'success', text: 'User added to organization successfully' });
      const updatedOrgs = await getUserOrganizations(selectedUser);
      setUserOrganizations(updatedOrgs);
    } catch (error) {
      console.error("Error adding user to organization:", error);
      setMessage({ type: 'error', text: 'Failed to add user to organization' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveFromOrg = async (organizationId) => {
    if (!confirm('Are you sure you want to remove this user from the organization?')) {
      return;
    }

    try {
      setProcessing(true);
      const m2mToken = await getM2MToken();
      await axios.post("/api/auth/removeUserFromOrganization", {
        m2mToken,
        organizationId,
        userId: selectedUser
      });
      setMessage({ type: 'success', text: 'User removed from organization successfully' });
      const updatedOrgs = await getUserOrganizations(selectedUser);
      setUserOrganizations(updatedOrgs);
    } catch (error) {
      console.error("Error removing user from organization:", error);
      setMessage({ type: 'error', text: 'Failed to remove user from organization' });
    } finally {
      setProcessing(false);
    }
  };

  const handleSearch = () => {
    getUsers(searchQuery);
  };

  const toggleUserExpand = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  useEffect(() => {
    getUsers();
    getOrganizations();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center">
        <FaUsers className="mr-2 text-blue-600" />
        User Management
      </h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by email, name, or user_id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaSearch />
          Search
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.user_id} className="border rounded-lg bg-white shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={u.picture || '/default-avatar.png'}
                    alt={u.name || u.email}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{u.name || u.email}</h3>
                      {u.email_verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-400">
                      Connection: {u.identities?.[0]?.connection || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserExpand(u.user_id)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {expandedUsers.has(u.user_id) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === u.user_id ? null : u.user_id)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <FaEllipsisV />
                    </button>
                    {actionMenuOpen === u.user_id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleResetFactors(u.user_id)}
                          disabled={processing}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          <FaSync className="text-orange-500" />
                          Reset MFA Factors
                        </button>
                        <button
                          onClick={() => handleAddToOrg(u.user_id)}
                          disabled={processing}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          <FaBuilding className="text-blue-500" />
                          Manage Organizations
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {expandedUsers.has(u.user_id) && (
                <div className="border-t p-4 bg-gray-50 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">User ID:</span>
                      <p className="text-gray-600 font-mono text-xs break-all">{u.user_id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p className="text-gray-600">{new Date(u.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Login:</span>
                      <p className="text-gray-600">
                        {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Logins Count:</span>
                      <p className="text-gray-600">{u.logins_count || 0}</p>
                    </div>
                  </div>
                  {u.user_metadata && Object.keys(u.user_metadata).length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">User Metadata:</span>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(u.user_metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Organization Management Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <FaBuilding className="mr-2 text-blue-600" />
                Manage User Organizations
              </h2>
              <button
                onClick={() => {
                  setShowOrgModal(false);
                  setSelectedUser(null);
                  setUserOrganizations([]);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Current Organizations</h3>
                {userOrganizations.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">User is not in any organizations</p>
                ) : (
                  <div className="space-y-2">
                    {userOrganizations.map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-blue-600" />
                          <span className="font-medium text-gray-800">{org.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromOrg(org.id)}
                          disabled={processing}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaUserMinus size={12} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Add to Organization</h3>
                <div className="space-y-2">
                  {organizations
                    .filter(org => !userOrganizations.some(uo => uo.id === org.id))
                    .map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-gray-600" />
                          <span className="font-medium text-gray-800">{org.name}</span>
                        </div>
                        <button
                          onClick={() => handleAddUserToOrganization(org.id)}
                          disabled={processing}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaUserPlus size={12} />
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
