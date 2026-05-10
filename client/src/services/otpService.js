import api from './api';

export const otpService = {
  sendEmailOTP: async (email) => {
    const response = await api.post('/otp/send-email', { email });
    return response;
  },

  verifyEmailOTP: async (email, otp) => {
    const response = await api.post('/otp/verify-email', { email, otp });
    return response;
  },

  sendPhoneOTP: async (phoneNumber) => {
    const response = await api.post('/otp/send-phone', { phoneNumber });
    return response;
  },

  verifyPhoneOTP: async (phoneNumber, otp) => {
    const response = await api.post('/otp/verify-phone', { phoneNumber, otp });
    return response;
  }
};
