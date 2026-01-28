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
    'firstName', // if separate first/last name fields
    'displayName',
    'nickname',
    'email' // fallback to email if no name found
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
          <h2 className="text-3xl sm:text-4xl font-[Cinzel] tracking-[0.25em] text-slate-100">
            Manage Users
          </h2>
          {loading && (
            <div className="flex items-center text-slate-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Updating...
            </div>
          )}
        </div>

        {/* Debug info - remove after you find the issue */}
        {users.length > 0 && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm">
            <p className="text-slate-300">Debug Info: Found {users.length} users</p>
            <p className="text-slate-400">First user keys: {Object.keys(users[0]).join(', ')}</p>
            <p className="text-slate-400">Extracted name: "{getUserName(users[0])}"</p>
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-center text-slate-400">No users found.</p>
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
                      {getUserName(u)}
                    </td>

                    <td className="p-4 text-slate-400">
                      {u.email || 'No Email'}
                    </td>

                    <td className="p-4 text-slate-500 text-xs">
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
                        className={`bg-gray-800 text-slate-200 px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition ${
                          updatingUserId === (u.id || u._id) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>

                    {/* ✅ ROLE DROPDOWN */}
                    <td className="p-4 text-center">
                      <select
                        value={u.role || "user"}
                        onChange={(e) =>
                          handleRoleChange(u.id || u._id, e.target.value)
                        }
                        disabled={updatingUserId === (u.id || u._id)}
                        className={`bg-gray-800 text-slate-200 px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400 transition ${
                          updatingUserId === (u.id || u._id) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
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
      </motion.div>
    </div>
  );
}