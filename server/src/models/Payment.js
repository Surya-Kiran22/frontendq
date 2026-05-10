const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    default: 500 // Monthly subscription fee
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'overdue'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    default: 'card'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Monthly subscription fee'
  },
  receiptUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
