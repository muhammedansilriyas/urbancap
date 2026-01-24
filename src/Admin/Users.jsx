import { motion } from "framer-motion";
import { useAdmin } from "./Context/AdminContext";
import { Shield, UserCog, UserX } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { users, updateUser, deleteUser } = useAdmin();
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // ✅ Update Role (Saves to DB)
  const handleRoleChange = async (id, newRole) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { role: newRole });
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Update Status (Active / Blocked)
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 flex justify-center ml-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-6xl shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        <h2 className="text-3xl sm:text-4xl text-center font-[Cinzel] tracking-[0.25em] text-slate-100 mb-8 sm:mb-10">
          Manage Users
        </h2>

        {users.length === 0 ? (
          <p className="text-center text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-800 text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left">Name</th>
                  <th className="p-3 sm:p-4 text-left">Email</th>
                  <th className="p-3 sm:p-4 text-center">Status</th>
                  <th className="p-3 sm:p-4 text-center">Role</th>
                  <th className="p-3 sm:p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-all duration-200"
                  >
                    <td className="p-3 sm:p-4 text-slate-100 whitespace-nowrap">
                      {u.name}
                    </td>

                    <td className="p-3 sm:p-4 text-slate-400 whitespace-nowrap">
                      {u.email}
                    </td>

                    {/* ✅ STATUS DROPDOWN (saves to DB) */}
                    <td className="p-3 sm:p-4 text-center">
                      <select
                        value={u.status || "active"}
                        onChange={(e) =>
                          handleStatusChange(u.id, e.target.value)
                        }
                        disabled={updatingUserId === u.id}
                        className={`bg-gray-800 text-slate-200 px-2 sm:px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                          updatingUserId === u.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>

                    {/* ✅ ROLE DROPDOWN (saves to DB) */}
                    <td className="p-3 sm:p-4 text-center">
                      <select
                        value={u.role || "user"}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value)
                        }
                        disabled={updatingUserId === u.id}
                        className={`bg-gray-800 text-slate-200 px-2 sm:px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                          updatingUserId === u.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-3 sm:p-4 flex items-center justify-center gap-3 sm:gap-4">
                      <button 
                        className="text-red-500 hover:text-red-400 transition" 
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={updatingUserId === u.id}
                      >
                        <UserX size={18} />
                      </button>
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