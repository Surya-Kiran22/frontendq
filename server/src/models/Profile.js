const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalDetails: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  education: {
    tenthPercentage: Number,
    tenthBoard: String,
    tenthYear: Number,
    tenthMarksUrl: String,
    intermediatePercentage: Number,
    intermediateBoard: String,
    intermediateYear: Number,
    intermediateMarksUrl: String,
    btechPercentage: Number,
    btechUniversity: String,
    btechYear: Number,
    cgpa: Number,
    backlogs: Number,
    backlogSemesters: String
  },
  documents: {
    resumeUrl: String,
    idCardUrl: String,
    intermediateMarksUrl: String,
    tenthMarksUrl: String
  },
  codingProfiles: {
    leetcode: String,
    hackerrank: String,
    codechef: String
  },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],
  achievements: [String],
  isComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
