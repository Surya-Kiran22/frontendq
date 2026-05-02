const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a test title']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  type: {
    type: String,
    enum: ['coding', 'aptitude', 'technical'],
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes']
  },
  instructions: String,
  passingScore: {
    type: Number,
    default: 70
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  rounds: {
    coding: {
      enabled: { type: Boolean, default: false },
      duration: Number,
      questionCount: Number,
      languages: [String]
    },
    aptitude: {
      enabled: { type: Boolean, default: false },
      duration: Number,
      questionCount: Number
    },
    technical: {
      enabled: { type: Boolean, default: false },
      duration: Number,
      questionCount: Number
    }
  },
  questions: [{
    type: {
      type: String,
      enum: ['mcq', 'coding'],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: [String],
    correctAnswer: String,
    explanation: String,
    marks: {
      type: Number,
      default: 1
    },
    language: String,
    starterCode: String,
    testCases: [{
      input: String,
      expected: String,
      isHidden: {
        type: Boolean,
        default: false
      }
    }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    }
  }],
  questionSets: {
    1: [mongoose.Schema.Types.ObjectId],
    2: [mongoose.Schema.Types.ObjectId],
    3: [mongoose.Schema.Types.ObjectId]
  },
  proctoring: {
    enableWebcam: { type: Boolean, default: false },
    enableScreenRecording: { type: Boolean, default: false },
    enableTabSwitchDetection: { type: Boolean, default: true },
    allowCopyPaste: { type: Boolean, default: false },
    allowRightClick: { type: Boolean, default: false }
  },
  settings: {
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    showResultsImmediately: { type: Boolean, default: true },
    allowReview: { type: Boolean, default: true },
    maxAttempts: { type: Number, default: 1 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

testSchema.index({ isActive: 1 });
testSchema.index({ companyId: 1 });

module.exports = mongoose.model('Test', testSchema);
