import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, getStoredUser, setStoredUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // If we have token but no user, try to load me
    if (token && !user) {
      api.getMe()
        .then((data) => {
          if (data) {
            const reconstructed = { username: data.username, role: data.authorities?.[0]?.authority || 'ROLE_USER' };
            setUser(reconstructed);
            setStoredUser(reconstructed);
          }
        })
        .catch(() => {
          // Token might be expired
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    setAuthToken(data.token);
    setToken(data.token);

    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };
    setUser(userInfo);
    setStoredUser(userInfo);
    setIsAuthModalOpen(false);
    return userInfo;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setAuthToken(data.token);
    setToken(data.token);

    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };
    setUser(userInfo);
    setStoredUser(userInfo);
    setIsAuthModalOpen(false);
    return userInfo;
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setStoredUser(null);
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openLogin,
        openRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
