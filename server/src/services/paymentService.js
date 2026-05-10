import api from './api';

export const paymentService = {
  // Get current user's payments
  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response;
  },

  // Get all payments (admin)
  getAllPayments: async (params) => {
    const response = await api.get('/payments', { params });
    return response;
  },

  // Get payments for a specific user (admin)
  getUserPayments: async (userId) => {
    const response = await api.get(`/payments/user/${userId}`);
    return response;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response;
  },

  // Create payment record
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response;
  },

  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process', paymentData);
    return response;
  },

  // Update payment status (admin)
  updatePaymentStatus: async (id, statusData) => {
    const response = await api.put(`/payments/${id}`, statusData);
    return response;
  },

  // Get payment statistics (admin)
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response;
  },

  // Delete payment (admin)
  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response;
  }
};
