import api from './api';

const ArticleService = {
  // Article operations
  createArticle: async (articleData) => {
    try {
      const response = await api.post('/api/articles', articleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticles: async (params = {}) => {
    try {
      const response = await api.get('/api/articles', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticleById: async (id) => {
    try {
      const response = await api.get(`/api/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateArticle: async (id, articleData) => {
    try {
      const response = await api.patch(`/api/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/api/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateArticleStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/articles/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Article file operations
  createArticleFile: async (fileData) => {
    try {
      const response = await api.post('/api/articles/files', fileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  uploadFile: async (formData) => {
    try {
      const response = await api.post('/api/articles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getArticleFiles: async (articleId) => {
    try {
      const response = await api.get(`/api/articles/${articleId}/files`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getFileById: async (id) => {
    try {
      const response = await api.get(`/api/articles/files/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateFile: async (id, fileData) => {
    try {
      const response = await api.patch(`/api/articles/files/${id}`, fileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteFile: async (id) => {
    try {
      const response = await api.delete(`/api/articles/files/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ArticleService;