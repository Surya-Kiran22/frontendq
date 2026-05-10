import api from './api';

export const resumeAnalyzerService = {
  analyzeResume: async (fileData, userProfile) => {
    const response = await api.post('/resume-analyzer/analyze', {
      fileData,
      userProfile
    });
    return response;
  }
};
