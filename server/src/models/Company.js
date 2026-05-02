const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  logo: String,
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  detailedDescription: String,
  requirements: String,
  importance: String,
  industry: String,
  location: String,
  website: String,
  package: String,
  visitDate: Date,
  intake: Number,
  eligibility: {
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    departments: [{
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Automobile', 'Instrumentation']
    }],
    year: {
      type: Number,
      required: true
    },
    backlogAllowed: {
      type: Boolean,
      default: false
    },
    skills: [String]
  },
  isCommonToAll: {
    type: Boolean,
    default: true
  },
  assignedBranches: [{
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Automobile', 'Instrumentation']
  }],
  selectionProcess: [{
    round: String,
    description: String,
    duration: String
  }],
  roles: [{
    title: String,
    department: String,
    salaryPackage: String
  }],
  requiredCourses: [{
    name: String,
    platform: String,
    url: String
  }],
  preparationMaterial: {
    practice: [{
      title: String,
      description: String,
      difficulty: String,
      duration: String,
      type: String,
      resourceUrl: String
    }],
    mockInterviews: [{
      title: String,
      description: String,
      type: String,
      duration: String
    }]
  },
  interviewTips: String,
  skills: [String],
  certifications: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
companySchema.index({ isActive: 1 });
companySchema.index({ visitDate: 1 });

module.exports = mongoose.model('Company', companySchema);
