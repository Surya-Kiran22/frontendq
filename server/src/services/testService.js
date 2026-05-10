import api from './api';

export const testService = {
  getAllTests: async () => {
    const response = await api.get('/tests');
    return response.tests;
  },

  getTestById: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.test;
  },

  createTest: async (testData) => {
    const response = await api.post('/tests', testData);
    return response.test;
  },

  updateTest: async (id, testData) => {
    const response = await api.put(`/tests/${id}`, testData);
    return response.test;
  },

  deleteTest: async (id) => {
    const response = await api.delete(`/tests/${id}`);
    return response;
  },

  submitTest: async (testId, submissionData) => {
    const response = await api.post(`/tests/${testId}/submit`, submissionData);
    return response.result;
  },

  getTestResults: async () => {
    const response = await api.get('/tests/results');
    return response.results;
  },

  getTestResultById: async (id) => {
    const response = await api.get(`/tests/results/${id}`);
    return response.result;
  }
};
