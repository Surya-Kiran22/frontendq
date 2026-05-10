import api from './api';

export const testService = {
  getAllTests: async () => {
    const response = await api.get('/tests');
    return response.data.tests;
  },

  getTestById: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data.test;
  },

  createTest: async (testData) => {
    const response = await api.post('/tests', testData);
    return response.data.test;
  },

  updateTest: async (id, testData) => {
    const response = await api.put(`/tests/${id}`, testData);
    return response.data.test;
  },

  deleteTest: async (id) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  },

  submitTest: async (testId, answers) => {
    const response = await api.post(`/tests/${testId}/submit`, { answers });
    return response.data;
  },

  getTestResults: async (testId) => {
    const response = await api.get(`/tests/${testId}/results`);
    return response.data;
  }
};
