const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  interviewRounds: [{
    round: String,
    date: Date,
    status: String,
    feedback: String
  }]
}, {
  timestamps: true
});

applicationSchema.index({ companyId: 1 });
applicationSchema.index({ userId: 1 });
applicationSchema.index({ companyId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
