const Payment = require('../models/Payment');
const User = require('../models/User');

const paymentController = {
  // Create payment record
  createPayment: async (req, res) => {
    try {
      const { userId, amount, month, year, paymentMethod } = req.body;
      
      // Check if payment already exists for this month
      const existingPayment = await Payment.findOne({
        userId,
        month,
        year
      });
      
      if (existingPayment) {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment already exists for this month' 
        });
      }
      
      // Calculate due date (5th of next month)
      const dueDate = new Date(year, month, 5);
      
      const payment = await Payment.create({
        userId,
        amount: amount || 500,
        month,
        year,
        dueDate,
        paymentMethod: paymentMethod || 'card',
        status: 'pending'
      });
      
      res.status(201).json({
        success: true,
        message: 'Payment record created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create payment' 
      });
    }
  },

  // Get all payments (admin only)
  getAllPayments: async (req, res) => {
    try {
      const { status, month, year, page = 1, limit = 10 } = req.query;
      
      const query = {};
      if (status) query.status = status;
      if (month) query.month = parseInt(month);
      if (year) query.year = parseInt(year);
      
      const payments = await Payment.find(query)
        .populate('userId', 'name email rollNumber department')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await Payment.countDocuments(query);
      
      res.json({
        success: true,
        data: payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch payments' 
      });
    }
  },

  // Get payments for a specific user
  getUserPayments: async (req, res) => {
    try {
      const { userId } = req.params;
      const payments = await Payment.find({ userId })
        .sort({ year: -1, month: -1 });
      
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching user payments:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user payments' 
      });
    }
  },

  // Get current user's payments
  getCurrentUserPayments: async (req, res) => {
    try {
      const userId = req.user.id;
      const payments = await Payment.find({ userId })
        .sort({ year: -1, month: -1 });
      
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching current user payments:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch payments' 
      });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id)
        .populate('userId', 'name email rollNumber department');
      
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Payment not found' 
        });
      }
      
      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch payment' 
      });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, transactionId, receiptUrl, paymentDate } = req.body;
      
      const payment = await Payment.findByIdAndUpdate(
        id,
        {
          status,
          transactionId,
          receiptUrl,
          paymentDate: paymentDate || new Date()
        },
        { new: true }
      ).populate('userId', 'name email rollNumber department');
      
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Payment not found' 
        });
      }
      
      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update payment' 
      });
    }
  },

  // Process payment (simulate payment gateway)
  processPayment: async (req, res) => {
    try {
      const { paymentId, paymentMethod } = req.body;
      
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Payment not found' 
        });
      }
      
      if (payment.status === 'paid') {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment already completed' 
        });
      }
      
      // Simulate payment processing
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      payment.status = 'paid';
      payment.paymentMethod = paymentMethod || 'card';
      payment.transactionId = transactionId;
      payment.paymentDate = new Date();
      await payment.save();
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process payment' 
      });
    }
  },

  // Get payment statistics (admin)
  getPaymentStats: async (req, res) => {
    try {
      const stats = await Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);
      
      const totalPayments = await Payment.countDocuments();
      const totalRevenue = await Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const overduePayments = await Payment.countDocuments({ 
        status: 'pending',
        dueDate: { $lt: new Date() }
      });
      
      res.json({
        success: true,
        data: {
          byStatus: stats,
          totalPayments,
          totalRevenue: totalRevenue[0]?.total || 0,
          overduePayments
        }
      });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch payment statistics' 
      });
    }
  },

  // Delete payment (admin only)
  deletePayment: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findByIdAndDelete(id);
      
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Payment not found' 
        });
      }
      
      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete payment' 
      });
    }
  }
};

module.exports = paymentController;
