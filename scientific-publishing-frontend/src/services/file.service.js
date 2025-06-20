import api from './api';

const FileService = {
  uploadFile: async (formData) => {
    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getFile: async (filename) => {
    try {
      const response = await api.get(`/api/files/${filename}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  downloadFile: async (filename) => {
    try {
      const response = await api.get(`/api/files/download/${filename}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  deleteFile: async (filename) => {
    try {
      const response = await api.delete(`/api/files/${filename}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default FileService;