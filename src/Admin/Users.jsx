import React from 'react';
import { motion } from "framer-motion";
import { useAdmin } from "./Context/AdminContext";
import { Shield, UserCog, UserX, Loader2 } from "lucide-react";
import { useState } from "react";

// Helper function to get user name from various possible fields
const getUserName = (user) => {
  if (!user) return 'Unknown User';
  
  // Try different possible name fields in order of priority
  const possibleNameFields = [
    'name',
    'fullName',
    'fullname',
    'username',
    'userName',
    'firstName',
    'displayName',
    'nickname',
    'email'
  ];
  
  for (const field of possibleNameFields) {
    if (user[field] && typeof user[field] === 'string') {
      return user[field];
    }
  }
  
  // If user has first and last name separately
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  
  // Return email as last resort
  return user.email || 'Unknown User';
};

export default function AdminUsers() {
  const { users, updateUser, deleteUser } = useAdmin();
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Update Role (Saves to DB)
  const handleRoleChange = async (id, newRole) => {
    setUpdatingUserId(id);
    setLoading(true);
    try {
      await updateUser(id, { role: newRole });
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setUpdatingUserId(null);
      setLoading(false);
    }
  };

  // ✅ Update Status (Active / Blocked)
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingUserId(id);
    setLoading(true);
    try {
      await updateUser(id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setUpdatingUserId(null);
      setLoading(false);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if users data is loaded correctly
  if (!users) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10 flex items-center justify-center">
        <div className="text-slate-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-7xl mx-auto shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl">
              <UserCog className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-100">
                User Management
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Manage user roles and status
              </p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center text-slate-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Updating...
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-slate-100">{users.length}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserCog className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Admins</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Regular Users</p>
                <p className="text-2xl font-bold text-blue-400">
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserCog className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <UserX className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No users found</p>
            <p className="text-slate-500 text-sm mt-1">Users will appear here once registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-800 text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <motion.tr
                    key={u.id || u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-all duration-200"
                  >
                    <td className="p-4 text-slate-100 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : u.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        {getUserName(u)}
                      </div>
                    </td>

                    <td className="p-4 text-slate-400">
                      {u.email || 'No Email'}
                    </td>

                    <td className="p-4 text-slate-500 text-xs font-mono">
                      {u.id || u._id || 'N/A'}
                    </td>

                    {/* ✅ STATUS DROPDOWN */}
                    <td className="p-4 text-center">
                      <select
                        value={u.status || "active"}
                        onChange={(e) =>
                          handleStatusChange(u.id || u._id, e.target.value)
                        }
                        disabled={updatingUserId === (u.id || u._id)}
                        className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-1 transition ${
                          u.status === 'active' 
                            ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50 focus:ring-emerald-400' 
                            : u.status === 'blocked'
                            ? 'bg-red-900/30 text-red-300 border-red-700/50 focus:ring-red-400'
                            : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50 focus:ring-yellow-400'
                        } ${
                          updatingUserId === (u.id || u._id) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                        }`}
                      >
                        <option value="active" className="bg-gray-800 text-slate-200">Active</option>
                        <option value="blocked" className="bg-gray-800 text-slate-200">Blocked</option>
                        <option value="pending" className="bg-gray-800 text-slate-200">Pending</option>
                      </select>
                    </td>

                    {/* ✅ ROLE DROPDOWN - Only User and Admin options */}
                    <td className="p-4 text-center">
                      <select
                        value={u.role || "user"}
                        onChange={(e) =>
                          handleRoleChange(u.id || u._id, e.target.value)
                        }
                        disabled={updatingUserId === (u.id || u._id)}
                        className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-1 transition ${
                          u.role === 'admin' 
                            ? 'bg-purple-900/30 text-purple-300 border-purple-700/50 focus:ring-purple-400' 
                            : 'bg-blue-900/30 text-blue-300 border-blue-700/50 focus:ring-blue-400'
                        } ${
                          updatingUserId === (u.id || u._id) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                        }`}
                      >
                        <option value="user" className="bg-gray-800 text-slate-200">User</option>
                        <option value="admin" className="bg-gray-800 text-slate-200">Admin</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className={`text-red-500 hover:text-red-400 transition p-2 rounded-md hover:bg-red-500/10 ${
                            updatingUserId === (u.id || u._id) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={() => handleDeleteUser(u.id || u._id)}
                          disabled={updatingUserId === (u.id || u._id) || loading}
                          title="Delete User"
                        >
                          <UserX size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Admin Role</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>User Role</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}