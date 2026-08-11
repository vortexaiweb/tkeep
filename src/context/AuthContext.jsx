import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, authenticateAdmin, logoutAdminSession, checkAdminAuthenticated } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check initial authentication from localStorage and Firebase Auth
    const checkAuth = () => {
      const isAuth = checkAdminAuthenticated();
      if (isAuth) {
        setIsAdmin(true);
        const stored = localStorage.getItem('tkeep_admin_user');
        setAdminUser(stored ? JSON.parse(stored) : { username: 'd2c', role: 'admin' });
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
      setIsAuthLoading(false);
    };

    checkAuth();

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdmin(true);
          setAdminUser({ username: user.email?.split('@')[0] || 'd2c', email: user.email, role: 'admin' });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const login = async (username, password) => {
    setIsAuthLoading(true);
    try {
      const user = await authenticateAdmin(username, password);
      setIsAdmin(true);
      setAdminUser(user);
      return user;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    await logoutAdminSession();
    setIsAdmin(false);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminUser, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
