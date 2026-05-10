import api from './api';

export const resumeAnalyzerService = {
  analyzeResume: async (resumeData) => {
    const response = await api.post('/resume-analyzer/analyze', resumeData);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resume-analyzer/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAnalysisHistory: async () => {
    const response = await api.get('/resume-analyzer/history');
    return response.data;
  }
};
