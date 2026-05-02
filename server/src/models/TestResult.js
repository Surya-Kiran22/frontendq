const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String,
    isCorrect: Boolean,
    timeTaken: Number,
    code: String
  }],
  startedAt: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true
  },
  tabSwitches: {
    type: Number,
    default: 0
  },
  proctoringData: {
    webcamCaptures: [String],
    screenRecordings: [String],
    tabSwitchEvents: [{
      timestamp: Date,
      tabTitle: String
    }]
  }
}, {
  timestamps: true
});

testResultSchema.index({ testId: 1 });
testResultSchema.index({ userId: 1 });
testResultSchema.index({ testId: 1, userId: 1 });

module.exports = mongoose.model('TestResult', testResultSchema);
