import api from './api';

export const otpService = {
  sendEmailOTP: async (email) => {
    const response = await api.post('/otp/send-email', { email });
    return response.data;
  },

  verifyEmailOTP: async (email, otp) => {
    const response = await api.post('/otp/verify-email', { email, otp });
    return response.data;
  },

  sendPhoneOTP: async (phoneNumber) => {
    const response = await api.post('/otp/send-phone', { phoneNumber });
    return response.data;
  },

  verifyPhoneOTP: async (phoneNumber, otp) => {
    const response = await api.post('/otp/verify-phone', { phoneNumber, otp });
    return response.data;
  }
};
