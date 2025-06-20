import api from './api';

const NotificationService = {
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/api/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/api/notifications', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateNotification: async (id, notificationData) => {
    try {
      const response = await api.patch(`/api/notifications/${id}`, notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/api/notifications/user/${userId}/count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  markAllAsRead: async (userId) => {
    try {
      const response = await api.patch(`/api/notifications/user/${userId}/read-all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default NotificationService;