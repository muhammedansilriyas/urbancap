import React, { createContext, useState, useContext, useEffect } from 'react';
import { BaseUrl } from '../SERVICES/Api';
const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    return {
      user: null,
      login: async () => ({ success: false, error: 'Auth not available' }),
      signup: async () => ({ success: false, error: 'Auth not available' }),
      logout: () => {},
      updateUser: async () => ({ success: false, error: 'Auth not available' }),
      loading: false
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = BaseUrl;

  useEffect(() => {
    const savedUser = localStorage.getItem('gameHubUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('gameHubUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password;
        setUser(userData);
        localStorage.setItem('gameHubUser', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData) => {
    try {
      const checkResponse = await fetch(`${API_BASE}/users?email=${userData.email}`);
      if (!checkResponse.ok) {
        throw new Error('Failed to check existing users');
      }
      
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser = {
        ...userData,
        wishlist: [],
        cart: [],
        purchaseHistory: [],
        addresses: [],
        createdAt: new Date().toISOString()
      };

      const createResponse = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create user');
      }

      const createdUser = await createResponse.json();
      
      const userWithoutPassword = { ...createdUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('gameHubUser', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gameHubUser');
  };

  const updateUser = async (userUpdates) => {
    try {
      
      const updatedUser = { 
        ...user,  
        ...userUpdates  
      };

      const response = await fetch(`${API_BASE}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      setUser(updatedUser);
      localStorage.setItem('gameHubUser', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  const updateUserPartial = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('gameHubUser', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    updateUserPartial,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};