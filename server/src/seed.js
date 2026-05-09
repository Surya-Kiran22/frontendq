const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Company = require('./models/Company');
const Test = require('./models/Test');

require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Company.deleteMany({});
    await Test.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('surya77688', 10);
    const admin = await User.create({
      name: 'Admin User',
      rollNumber: '77688',
      email: 'admin@placement.com',
      password: adminPassword,
      role: 'admin',
      department: 'CSE',
      year: 4
    });
    console.log('Created admin user');

    // Create sample student users
    const departments = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Automobile', 'Instrumentation'];
    const studentUsers = [];
    
    for (let i = 1; i <= 10; i++) {
      const rollNumber = `23761A05${String(i).padStart(2, '0')}`;
      const password = await bcrypt.hash('password123', 10);
      const user = await User.create({
        name: `Student ${i}`,
        rollNumber,
        email: `student${i}@example.com`,
        password,
        role: 'student',
        department: departments[i % departments.length],
        year: [3, 4][i % 2]
      });
      studentUsers.push(user);
      
      // Create profile for each student
      await Profile.create({
        userId: user._id,
        personalDetails: {
          firstName: `Student`,
          lastName: `${i}`,
          phone: `98765432${String(i).padStart(2, '0')}`
        },
        education: {
          cgpa: (7 + Math.random() * 2).toFixed(2),
          backlogs: 0,
          backlogSemesters: ''
        },
        skills: {
          languages: ['Python', 'JavaScript'],
          tools: ['Git', 'VS Code'],
          roles: ['Software Developer']
        },
        documents: {},
        placementStatus: 'Not Placed'
      });
    }
    console.log('Created 10 student users with profiles');

    // Create sample companies
    const companies = [
      {
        name: 'TCS',
        description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
        website: 'https://www.tcs.com',
        industry: 'IT Services',
        eligibility: {
          cgpa: 7.0,
          departments: ['CSE', 'IT', 'ECE'],
          backlogAllowed: true,
          maxBacklogs: 2
        },
        selectionProcess: ['Online Test', 'Technical Interview', 'HR Interview'],
        roles: ['Software Engineer', 'System Engineer'],
        salary: {
          ctc: 750000,
          base: 600000,
          variable: 150000
        },
        isActive: true
      },
      {
        name: 'Infosys',
        description: 'Infosys is an Indian multinational corporation that provides business consulting, information technology and outsourcing services.',
        website: 'https://www.infosys.com',
        industry: 'IT Services',
        eligibility: {
          cgpa: 6.5,
          departments: ['CSE', 'IT', 'ECE', 'EEE'],
          backlogAllowed: true,
          maxBacklogs: 2
        },
        selectionProcess: ['Online Test', 'Technical Interview', 'HR Interview'],
        roles: ['Software Engineer', 'Systems Engineer'],
        salary: {
          ctc: 700000,
          base: 550000,
          variable: 150000
        },
        isActive: true
      },
      {
        name: 'Wipro',
        description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
        website: 'https://www.wipro.com',
        industry: 'IT Services',
        eligibility: {
          cgpa: 6.5,
          departments: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'],
          backlogAllowed: true,
          maxBacklogs: 3
        },
        selectionProcess: ['Online Test', 'Technical Interview', 'HR Interview'],
        roles: ['Project Engineer', 'Software Developer'],
        salary: {
          ctc: 650000,
          base: 500000,
          variable: 150000
        },
        isActive: true
      },
      {
        name: 'Amazon',
        description: 'Amazon is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
        website: 'https://www.amazon.com',
        industry: 'E-commerce & Cloud',
        eligibility: {
          cgpa: 8.0,
          departments: ['CSE', 'IT'],
          backlogAllowed: false,
          maxBacklogs: 0
        },
        selectionProcess: ['Online Assessment', 'Technical Rounds', 'Managerial Interview'],
        roles: ['Software Development Engineer', 'SDE Intern'],
        salary: {
          ctc: 2500000,
          base: 2000000,
          variable: 500000
        },
        isActive: true
      },
      {
        name: 'Microsoft',
        description: 'Microsoft Corporation is an American multinational technology corporation producing computer software and consumer electronics.',
        website: 'https://www.microsoft.com',
        industry: 'Technology',
        eligibility: {
          cgpa: 8.5,
          departments: ['CSE', 'IT'],
          backlogAllowed: false,
          maxBacklogs: 0
        },
        selectionProcess: ['Online Assessment', 'Technical Rounds', 'HR Interview'],
        roles: ['Software Engineer', 'Product Manager'],
        salary: {
          ctc: 3000000,
          base: 2500000,
          variable: 500000
        },
        isActive: true
      }
    ];

    await Company.insertMany(companies);
    console.log('Created 5 sample companies');

    // Create sample tests
    const tests = [
      {
        title: 'Aptitude Test',
        description: 'General aptitude test with quantitative, logical reasoning, and verbal sections',
        type: 'aptitude',
        duration: 60,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'If A = 5 and B = 3, what is A + B?',
            options: ['6', '8', '7', '9'],
            correctAnswer: 2,
            marks: 1
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'Which of the following is a prime number?',
            options: ['4', '6', '7', '9'],
            correctAnswer: 2,
            marks: 1
          },
          {
            id: 3,
            type: 'multiple-choice',
            question: 'What is 20% of 100?',
            options: ['10', '20', '30', '40'],
            correctAnswer: 1,
            marks: 1
          }
        ],
        passingScore: 60,
        proctoring: {
          enabled: false,
          webcamRequired: false,
          screenShareRequired: false
        },
        isActive: true
      },
      {
        title: 'Technical Assessment',
        description: 'Technical test covering programming concepts and problem-solving',
        type: 'coding',
        duration: 90,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
            correctAnswer: 1,
            marks: 2
          },
          {
            id: 2,
            type: 'coding',
            question: 'Write a function to find the maximum element in an array',
            language: 'any',
            testCases: [
              {
                input: '[1, 2, 3, 4, 5]',
                output: '5'
              },
              {
                input: '[10, 20, 5, 15]',
                output: '20'
              }
            ],
            marks: 5
          }
        ],
        passingScore: 50,
        proctoring: {
          enabled: true,
          webcamRequired: true,
          screenShareRequired: false
        },
        isActive: true
      }
    ];

    await Test.insertMany(tests);
    console.log('Created 2 sample tests');

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
