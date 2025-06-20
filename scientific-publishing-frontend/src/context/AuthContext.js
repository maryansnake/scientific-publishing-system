import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = async () => {
      if (AuthService.isLoggedIn()) {
        try {
          const user = await AuthService.getProfile();
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          AuthService.logout();
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    if (response.accessToken) {
      const user = await AuthService.getProfile();
         console.log(user);
      setCurrentUser(user);
      return user;
    }
    return null;
  };
  
  const register = async (userData) => {
    const response = await AuthService.register(userData);
    return response;
  };
  
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};