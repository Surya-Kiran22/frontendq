import api from './api';

export const paymentService = {
  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  getAllPayments: async (params) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getUserPayments: async (userId) => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePaymentStatus: async (id, status) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },

  processPayment: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/process`);
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  }
};
