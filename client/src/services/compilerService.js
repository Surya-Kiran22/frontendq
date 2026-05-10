import api from './api';

export const compilerService = {
  compile: async (code, language, testCases) => {
    const response = await api.post('/compiler/compile', {
      code,
      language,
      testCases
    });
    return response.data;
  }
};
