import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  getAllStudents: async (params) => {
    const response = await api.get('/auth/students', { params });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/auth/students/${id}`);
    return response.data;
  },

  updateStudentStatus: async (id, status) => {
    const response = await api.put(`/auth/students/${id}/status`, { status });
    return response.data;
  }
};
