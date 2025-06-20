import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ReviewService {
  // Отримати всі рецензії з фільтрами
  async getReviews(filters = {}) {
    const { articleId, reviewerId, status } = filters;
    let queryParams = new URLSearchParams();
    
    if (articleId) queryParams.append('articleId', articleId);
    if (reviewerId) queryParams.append('reviewerId', reviewerId);
    if (status) queryParams.append('status', status);
    
    const response = await api.get(`${API_URL}/reviews?${queryParams}`);
    return response.data;
  }
  
  // Отримати рецензію за ID
  async getReviewById(id) {
    const response = await api.get(`${API_URL}/reviews/${id}`);
    return response.data;
  }
  
  // Створити нову рецензію
  async createReview(reviewData) {
    const response = await api.post(`${API_URL}/reviews`, reviewData);
    return response.data;
  }
  
  // Оновити рецензію
  async updateReview(id, reviewData) {
    const response = await api.patch(`${API_URL}/reviews/${id}`, reviewData);
    return response.data;
  }
  
  // Видалити рецензію
  async deleteReview(id) {
    const response = await api.delete(`${API_URL}/reviews/${id}`);
    return response.data;
  }
  
  // Отримати підсумок рецензій для статті
  async getArticleReviewsSummary(articleId) {
    const response = await api.get(`${API_URL}/reviews/summary/${articleId}`);
    return response.data;
  }
  
  // Завантажити файл рецензії
  async uploadReviewFile(file, reviewId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reviewId', reviewId);
    
    const response = await api.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export default new ReviewService();