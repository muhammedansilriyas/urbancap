import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* User Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Account Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Member Since</span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Phone</span>
              <span>{user.phone || 'Not provided'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              My Wishlist
            </button>
            <button
              onClick={() => navigate('/addresses')}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              My Addresses
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleAccountPage;