import api from './api';
import { jwtDecode } from 'jwt-decode';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Store user info
        const decodedToken = jwtDecode(response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(decodedToken));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteAccount: async () => {
    try {
      const response = await api.delete('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', { 
        token,
        password: newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/api/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;