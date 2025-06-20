import api from './api';

const JournalService = {
  // Journal operations
  createJournal: async (journalData) => {
    try {
      const response = await api.post('/api/journals', journalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getJournals: async (params = {}) => {
    try {
      const response = await api.get('/api/journals', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getJournalById: async (id) => {
    try {
      const response = await api.get(`/api/journals/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getJournalBySlug: async (slug) => {
    try {
      const response = await api.get(`/api/journals/by-slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateJournal: async (id, journalData) => {
    try {
      const response = await api.patch(`/api/journals/${id}`, journalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteJournal: async (id) => {
    try {
      const response = await api.delete(`/api/journals/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Issue operations
  createIssue: async (issueData) => {
    try {
      const response = await api.post('/api/journals/issues', issueData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getIssuesByJournal: async (journalId, params = {}) => {
    try {
      const response = await api.get(`/api/journals/${journalId}/issues`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/api/journals/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateIssue: async (id, issueData) => {
    try {
      const response = await api.patch(`/api/journals/issues/${id}`, issueData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteIssue: async (id) => {
    try {
      const response = await api.delete(`/api/journals/issues/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default JournalService;