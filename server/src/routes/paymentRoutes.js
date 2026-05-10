const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/stats', authMiddleware, paymentController.getPaymentStats);

// Protected routes - Student
router.get('/my-payments', authMiddleware, paymentController.getCurrentUserPayments);
router.post('/process', authMiddleware, paymentController.processPayment);

// Protected routes - Admin
router.post('/', authMiddleware, paymentController.createPayment);
router.get('/', authMiddleware, paymentController.getAllPayments);
router.get('/user/:userId', authMiddleware, paymentController.getUserPayments);
router.get('/:id', authMiddleware, paymentController.getPaymentById);
router.put('/:id', authMiddleware, paymentController.updatePaymentStatus);
router.delete('/:id', authMiddleware, paymentController.deletePayment);

module.exports = router;
