import api from './api';

export const aiInterviewService = {
  checkPlacementStatus: async () => {
    const response = await api.get('/ai-interview/placement-status');
    return response;
  },

  submitInterview: async (answers) => {
    const response = await api.post('/ai-interview/submit', { answers });
    return response;
  }
};
