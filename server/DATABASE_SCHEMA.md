# Database Schema Design

## MongoDB Schema Structure

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  rollNumber: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  department: String (enum: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Automobile', 'Instrumentation']),
  year: Number,
  cgpa: Number,
  skills: [String],
  certifications: [String],
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
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
    tenthMarksUrl: String, // AWS S3 URL
    intermediatePercentage: Number,
    intermediateBoard: String,
    intermediateYear: Number,
    intermediateMarksUrl: String, // AWS S3 URL
    btechPercentage: Number,
    btechUniversity: String,
    btechYear: Number,
    cgpa: Number,
    backlogs: Number,
    backlogSemesters: String
  },
  documents: {
    resumeUrl: String, // AWS S3 URL
    idCardUrl: String, // AWS S3 URL
    intermediateMarksUrl: String, // AWS S3 URL
    tenthMarksUrl: String // AWS S3 URL
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
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Companies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  logo: String (AWS S3 URL),
  description: String,
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
    cgpa: Number,
    departments: [String], // ['CSE', 'IT', 'ECE', etc.]
    year: Number,
    backlogAllowed: Boolean,
    skills: [String]
  },
  isCommonToAll: Boolean,
  assignedBranches: [String], // ['CSE', 'IT', etc.] if not common to all
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
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Tests Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String (enum: ['coding', 'aptitude', 'technical']),
  duration: Number, // in minutes
  instructions: String,
  passingScore: Number,
  companyId: ObjectId (ref: Companies), // optional
  rounds: {
    coding: {
      enabled: Boolean,
      duration: Number,
      questionCount: Number,
      languages: [String]
    },
    aptitude: {
      enabled: Boolean,
      duration: Number,
      questionCount: Number
    },
    technical: {
      enabled: Boolean,
      duration: Number,
      questionCount: Number
    }
  },
  questions: [{
    _id: ObjectId,
    type: String (enum: ['mcq', 'coding']),
    question: String,
    options: [String], // for MCQ
    correctAnswer: String, // for MCQ
    explanation: String,
    marks: Number,
    language: String, // for coding
    starterCode: String, // for coding
    testCases: [{
      input: String,
      expected: String,
      isHidden: Boolean
    }],
    difficulty: String
  }],
  questionSets: {
    1: [ObjectId], // Array of question IDs for set 1
    2: [ObjectId], // Array of question IDs for set 2
    3: [ObjectId]  // Array of question IDs for set 3
  },
  proctoring: {
    enableWebcam: Boolean,
    enableScreenRecording: Boolean,
    enableTabSwitchDetection: Boolean,
    allowCopyPaste: Boolean,
    allowRightClick: Boolean
  },
  settings: {
    shuffleQuestions: Boolean,
    shuffleOptions: Boolean,
    showResultsImmediately: Boolean,
    allowReview: Boolean,
    maxAttempts: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. TestResults Collection
```javascript
{
  _id: ObjectId,
  testId: ObjectId (ref: Tests),
  userId: ObjectId (ref: Users),
  score: Number,
  totalScore: Number,
  percentage: Number,
  passed: Boolean,
  answers: [{
    questionId: ObjectId,
    answer: String,
    isCorrect: Boolean,
    timeTaken: Number,
    code: String // for coding questions
  }],
  startedAt: Date,
  submittedAt: Date,
  timeTaken: Number,
  tabSwitches: Number,
  proctoringData: {
    webcamCaptures: [String], // AWS S3 URLs
    screenRecordings: [String], // AWS S3 URLs
    tabSwitchEvents: [{
      timestamp: Date,
      tabTitle: String
    }]
  },
  createdAt: Date
}
```

### 6. CompanyBranchMappings Collection
```javascript
{
  _id: ObjectId,
  companyId: ObjectId (ref: Companies),
  isCommonToAll: Boolean,
  assignedBranches: [String], // ['CSE', 'IT', 'ECE', etc.]
  updatedAt: Date,
  updatedBy: ObjectId (ref: Users)
}
```

### 7. Applications Collection
```javascript
{
  _id: ObjectId,
  companyId: ObjectId (ref: Companies),
  userId: ObjectId (ref: Users),
  status: String (enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected']),
  appliedAt: Date,
  interviewRounds: [{
    round: String,
    date: Date,
    status: String,
    feedback: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## AWS S3 Bucket Structure

```
placement-system-bucket/
├── documents/
│   ├── resumes/
│   │   ├── {userId}/resume_{timestamp}.pdf
│   ├── id-cards/
│   │   ├── {userId}/idcard_{timestamp}.pdf
│   ├── marksheets/
│   │   ├── {userId}/tenth_{timestamp}.pdf
│   │   ├── {userId}/intermediate_{timestamp}.pdf
│   └── other-documents/
│       └── {userId}/{filename}_{timestamp}.pdf
├── company-logos/
│   ├── {companyId}/logo_{timestamp}.png
│   └── {companyId}/logo_{timestamp}.jpg
├── proctoring/
│   ├── webcam/
│   │   ├── {testId}_{userId}_{timestamp}.webm
│   └── screen/
│       ├── {testId}_{userId}_{timestamp}.webm
└── test-uploads/
    └── {testId}_{userId}_{timestamp}.pdf
```

## Indexes

### Users Collection
- rollNumber (unique, indexed)
- email (unique, indexed)
- role (indexed)

### Profiles Collection
- userId (unique, indexed)

### Companies Collection
- isActive (indexed)
- visitDate (indexed)

### Tests Collection
- isActive (indexed)
- companyId (indexed)

### TestResults Collection
- testId (indexed)
- userId (indexed)
- testId + userId (compound index)

### Applications Collection
- companyId (indexed)
- userId (indexed)
- companyId + userId (compound index)
- status (indexed)
