import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profiles');
    return response.profile;
  },

  createOrUpdateProfile: async (profileData) => {
    const response = await api.post('/profiles', profileData);
    return response.profile;
  },

  uploadDocument: async (file, documentType) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await api.post('/profiles/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  getAllProfiles: async () => {
    const response = await api.get('/profiles/all');
    return response.profiles;
  },

  getProfileByUserId: async (userId) => {
    const response = await api.get(`/profiles/user/${userId}`);
    return response.profile;
  }
};
