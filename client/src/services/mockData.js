// Mock Data Service for Standalone Frontend
// This file contains all mock data to replace API calls

// Mock Users
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    rollNumber: '77688',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'CSE',
    year: 4,
    cgpa: 9.5,
    skills: ['React', 'Node.js', 'MongoDB'],
    certifications: ['AWS', 'Google Cloud'],
    isAdmin: true,
    password: 'surya77688'
  },
  {
    _id: '2',
    name: 'John Doe',
    rollNumber: '23761A05M9',
    email: 'john@college.edu',
    role: 'student',
    department: 'CSE',
    year: 3,
    cgpa: 8.5,
    skills: ['Python', 'Java', 'Data Structures'],
    certifications: ['Python Certified'],
    isAdmin: false,
    password: 'password123'
  }
];

// Mock Companies (36 companies)
const mockCompanies = [
  {
    _id: '1',
    name: 'TCS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png',
    description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
    detailedDescription: 'TCS is one of the largest IT services companies in the world, with over 600,000 employees across 46 countries. It is a part of the Tata Group and operates in multiple domains including banking, insurance, healthcare, and retail. TCS is known for its strong work culture, extensive training programs, and global opportunities.',
    requirements: 'Candidates must have strong programming skills in Java, Python, or C++. Good communication skills and problem-solving abilities are essential. Knowledge of data structures, algorithms, and database management is required.',
    importance: 'TCS is a dream company for many freshers due to its global presence, excellent training programs, and career growth opportunities. Being selected by TCS opens doors to work on cutting-edge technologies and international projects.',
    industry: 'IT Services',
    location: 'Mumbai, India',
    website: 'https://www.tcs.com',
    package: '7-12 LPA',
    visitDate: '2025-06-15',
    intake: 150,
    eligibility: {
      cgpa: 7.0,
      departments: ['CSE', 'ECE', 'EEE', 'IT'],
      year: 2025,
      backlogAllowed: false,
      skills: ['Java', 'Python', 'SQL', 'Aptitude']
    },
    selectionProcess: [
      { round: 'Aptitude Test', description: 'Quantitative, Logical Reasoning, and Verbal Ability assessment', duration: '60 minutes' },
      { round: 'Coding Round', description: 'Programming test on data structures and algorithms', duration: '90 minutes' },
      { round: 'Communication Round', description: 'Group discussion and verbal communication assessment', duration: '30 minutes' },
      { round: 'Video Interview', description: 'Technical interview with video recording', duration: '45 minutes' },
      { round: 'AI HR Interview', description: 'AI-powered behavioral and HR interview', duration: '30 minutes' }
    ],
    roles: [
      { title: 'System Engineer', department: 'IT Services', salaryPackage: '7-8 LPA' },
      { title: 'Software Developer', department: 'Development', salaryPackage: '8-10 LPA' },
      { title: 'Data Analyst', department: 'Analytics', salaryPackage: '9-11 LPA' }
    ],
    requiredCourses: [
      { name: 'Data Structures and Algorithms', platform: 'Coursera', url: '#' },
      { name: 'Java Programming', platform: 'Udemy', url: '#' },
      { name: 'SQL Fundamentals', platform: 'W3Schools', url: '#' },
      { name: 'Communication Skills', platform: 'LinkedIn Learning', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Aptitude Practice Set 1', description: 'Quantitative and logical reasoning questions', difficulty: 'Medium', duration: '45 mins', type: 'Aptitude', resourceUrl: '#' },
        { title: 'Coding Challenge', description: 'Data structures and algorithms problems', difficulty: 'Hard', duration: '90 mins', type: 'Coding', resourceUrl: '#' },
        { title: 'Communication Mock', description: 'Group discussion practice', difficulty: 'Easy', duration: '30 mins', type: 'Communication', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Aptitude Test', description: 'Simulated aptitude assessment', type: 'Aptitude', duration: '60 mins' },
        { title: 'Mock Coding Round', description: 'Practice coding problems', type: 'Coding', duration: '90 mins' },
        { title: 'Mock HR Interview', description: 'AI-powered HR interview simulation', type: 'AI HR', duration: '30 mins' }
      ]
    },
    interviewTips: 'Focus on basics, communication skills, and aptitude preparation.',
    skills: ['Java', 'Python', 'SQL', 'Aptitude', 'Communication'],
    certifications: ['Java Certification', 'Python Certification'],
    isActive: true
  },
  {
    _id: '2',
    name: 'Infosys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png',
    description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
    detailedDescription: 'Infosys is a global leader in next-generation digital services and consulting. With over 300,000 employees, it helps clients in more than 50 countries navigate their digital transformation. Infosys is known for its strong training programs, innovation-driven culture, and focus on sustainability.',
    requirements: 'Strong programming skills in Java, Python, or C++. Good analytical and problem-solving abilities. Excellent communication skills and teamwork capabilities.',
    importance: 'Infosys offers excellent career growth opportunities, global exposure, and comprehensive training programs. Being selected by Infosys provides a strong foundation for a career in IT services.',
    industry: 'IT Services',
    location: 'Bangalore, India',
    website: 'https://www.infosys.com',
    package: '6-10 LPA',
    visitDate: '2025-07-20',
    intake: 200,
    eligibility: {
      cgpa: 6.5,
      departments: ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical'],
      year: 2025,
      backlogAllowed: false,
      skills: ['Python', 'Java', 'Aptitude']
    },
    selectionProcess: [
      { round: 'Online Assessment', description: 'Aptitude, logical reasoning, and verbal ability', duration: '90 minutes' },
      { round: 'Coding Round', description: 'Programming test on data structures and algorithms', duration: '60 minutes' },
      { round: 'Technical Interview', description: 'Technical discussion on projects and coding', duration: '45 minutes' },
      { round: 'HR Interview', description: 'Behavioral and HR assessment', duration: '30 minutes' }
    ],
    roles: [
      { title: 'Systems Engineer', department: 'IT Services', salaryPackage: '6-8 LPA' },
      { title: 'Software Engineer', department: 'Development', salaryPackage: '7-9 LPA' },
      { title: 'Digital Specialist Engineer', department: 'Digital', salaryPackage: '8-10 LPA' }
    ],
    requiredCourses: [
      { name: 'Data Structures', platform: 'Coursera', url: '#' },
      { name: 'Java Programming', platform: 'Udemy', url: '#' },
      { name: 'Aptitude Preparation', platform: 'Fresherworld', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Infosys Aptitude Practice', description: 'Quantitative and logical reasoning', difficulty: 'Medium', duration: '60 mins', type: 'Aptitude', resourceUrl: '#' },
        { title: 'Coding Practice', description: 'Programming problems', difficulty: 'Hard', duration: '60 mins', type: 'Coding', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Technical Interview', description: 'Technical interview simulation', type: 'Technical', duration: '45 mins' },
        { title: 'Mock HR Interview', description: 'HR interview simulation', type: 'HR', duration: '30 mins' }
      ]
    },
    interviewTips: 'Prepare well for puzzles, coding questions, and be ready to explain your projects clearly.',
    skills: ['Python', 'Java', 'C++', 'Problem Solving'],
    certifications: ['Infosys Certification'],
    isActive: true
  },
  {
    _id: '3',
    name: 'Wipro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color.png/1200px-Wipro_Primary_Logo_Color.png',
    description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
    industry: 'IT Services',
    location: 'Bangalore, India',
    website: 'https://www.wipro.com',
    package: '5-9 LPA',
    eligibility: {
      cgpa: 6.0,
      departments: ['CSE', 'ECE', 'EEE', 'IT'],
      year: 2025,
      backlogAllowed: true,
      skills: ['Java', 'SQL', 'Aptitude']
    },
    selectionProcess: [
      { round: 'Aptitude Test', description: 'Quantitative, Logical Reasoning, and Verbal Ability assessment', duration: '60 minutes' },
      { round: 'Coding Round', description: 'Programming test on data structures and algorithms', duration: '90 minutes' },
      { round: 'Communication Round', description: 'Group discussion and verbal communication assessment', duration: '30 minutes' },
      { round: 'Video Interview', description: 'Technical interview with video recording', duration: '45 minutes' },
      { round: 'AI HR Interview', description: 'AI-powered behavioral and HR interview', duration: '30 minutes' }
    ],
    roles: [
      { title: 'System Engineer', department: 'IT Services', salaryPackage: '7-8 LPA' },
      { title: 'Software Developer', department: 'Development', salaryPackage: '8-10 LPA' },
      { title: 'Data Analyst', department: 'Analytics', salaryPackage: '9-11 LPA' }
    ],
    requiredCourses: [
      { name: 'Data Structures and Algorithms', platform: 'Coursera', url: '#' },
      { name: 'Java Programming', platform: 'Udemy', url: '#' },
      { name: 'SQL Fundamentals', platform: 'W3Schools', url: '#' },
      { name: 'Communication Skills', platform: 'LinkedIn Learning', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Aptitude Practice Set 1', description: 'Quantitative and logical reasoning questions', difficulty: 'Medium', duration: '45 mins', type: 'Aptitude', resourceUrl: '#' },
        { title: 'Coding Challenge', description: 'Data structures and algorithms problems', difficulty: 'Hard', duration: '90 mins', type: 'Coding', resourceUrl: '#' },
        { title: 'Communication Mock', description: 'Group discussion practice', difficulty: 'Easy', duration: '30 mins', type: 'Communication', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Aptitude Test', description: 'Simulated aptitude assessment', type: 'Aptitude', duration: '60 mins' },
        { title: 'Mock Coding Round', description: 'Practice coding problems', type: 'Coding', duration: '90 mins' },
        { title: 'Mock HR Interview', description: 'AI-powered HR interview simulation', type: 'AI HR', duration: '30 mins' }
      ]
    },
    interviewTips: 'Be confident and clear in your answers.',
    skills: ['Java', 'SQL', 'Communication'],
    certifications: ['Wipro Certification'],
    isActive: true
  },
  {
    _id: '4',
    name: 'Accenture',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Accenture_logo.svg/1200px-Accenture_logo.svg.png',
    description: 'Accenture is a global professional services company with leading capabilities in digital, cloud and security.',
    detailedDescription: 'Accenture is a Fortune Global 500 company with over 700,000 employees serving clients in more than 120 countries. It specializes in digital transformation, cloud services, and technology consulting. Accenture is known for its innovative approach, diverse workforce, and strong emphasis on continuous learning.',
    requirements: 'Strong analytical and problem-solving skills. Good communication and interpersonal abilities. Knowledge of cloud technologies, data analytics, or digital technologies is preferred.',
    importance: 'Accenture offers exposure to cutting-edge technologies, global projects, and excellent career development opportunities. It is a great place to build expertise in digital transformation and consulting.',
    industry: 'Consulting',
    location: 'Dublin, Ireland',
    website: 'https://www.accenture.com',
    package: '8-15 LPA',
    visitDate: '2025-08-10',
    intake: 100,
    eligibility: {
      cgpa: 7.0,
      departments: ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical'],
      year: 2025,
      backlogAllowed: false,
      skills: ['Aptitude', 'Communication', 'Technical']
    },
    selectionProcess: [
      { round: 'Cognitive Assessment', description: 'Aptitude, reasoning, and technical assessment', duration: '75 minutes' },
      { round: 'Technical Assessment', description: 'Coding and technical skills evaluation', duration: '60 minutes' },
      { round: 'Communication Round', description: 'Group discussion and verbal communication', duration: '30 minutes' },
      { round: 'Technical Interview', description: 'Technical discussion and problem-solving', duration: '45 minutes' },
      { round: 'HR Interview', description: 'Behavioral and cultural fit assessment', duration: '30 minutes' }
    ],
    roles: [
      { title: 'Software Engineer', department: 'Technology', salaryPackage: '8-10 LPA' },
      { title: 'Data Analyst', department: 'Analytics', salaryPackage: '10-12 LPA' },
      { title: 'Cloud Consultant', department: 'Cloud', salaryPackage: '12-15 LPA' }
    ],
    requiredCourses: [
      { name: 'Cloud Computing', platform: 'Coursera', url: '#' },
      { name: 'Data Analytics', platform: 'Udemy', url: '#' },
      { name: 'Communication Skills', platform: 'LinkedIn Learning', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Cognitive Assessment Practice', description: 'Aptitude and reasoning', difficulty: 'Medium', duration: '75 mins', type: 'Aptitude', resourceUrl: '#' },
        { title: 'Technical Assessment', description: 'Technical skills', difficulty: 'Hard', duration: '60 mins', type: 'Coding', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Technical Interview', description: 'Technical interview simulation', type: 'Technical', duration: '45 mins' },
        { title: 'Mock HR Interview', description: 'HR interview simulation', type: 'HR', duration: '30 mins' }
      ]
    },
    interviewTips: 'Focus on problem-solving, communication skills, and research about Accenture before the interview.',
    skills: ['Problem Solving', 'Communication', 'Technical'],
    certifications: ['Accenture Certification'],
    isActive: true
  },
  {
    _id: '5',
    name: 'Cognizant',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cognizant_Logo.png/1200px-Cognizant_Logo.png',
    description: 'Cognizant is an American multinational technology company that provides business consulting, information technology and outsourcing services.',
    detailedDescription: 'Cognizant is a multinational technology company with over 350,000 employees across the globe. It specializes in digital transformation, IT services, and consulting. Cognizant is known for its client-centric approach, innovation, and focus on emerging technologies.',
    requirements: 'Strong programming skills in Java, Python, or JavaScript. Good understanding of data structures and algorithms. Excellent communication and teamwork skills.',
    importance: 'Cognizant provides opportunities to work on diverse projects across industries, with strong training programs and career growth paths. It is an excellent platform for freshers to start their IT careers.',
    industry: 'IT Services',
    location: 'Teaneck, New Jersey',
    website: 'https://www.cognizant.com',
    package: '6-12 LPA',
    visitDate: '2025-09-05',
    intake: 180,
    eligibility: {
      cgpa: 6.5,
      departments: ['CSE', 'ECE', 'EEE', 'IT'],
      year: 2025,
      backlogAllowed: false,
      skills: ['Java', 'Python', 'Aptitude']
    },
    selectionProcess: [
      { round: 'Online Test', description: 'Aptitude, technical, and coding assessment', duration: '90 minutes' },
      { round: 'Technical Interview', description: 'Coding and technical discussion', duration: '45 minutes' },
      { round: 'Communication Round', description: 'Group discussion and communication', duration: '30 minutes' },
      { round: 'HR Interview', description: 'Behavioral and HR assessment', duration: '30 minutes' }
    ],
    roles: [
      { title: 'Programmer Analyst', department: 'IT Services', salaryPackage: '6-8 LPA' },
      { title: 'Software Engineer', department: 'Development', salaryPackage: '8-10 LPA' },
      { title: 'Associate Engineer', department: 'Digital', salaryPackage: '10-12 LPA' }
    ],
    requiredCourses: [
      { name: 'Full Stack Development', platform: 'Coursera', url: '#' },
      { name: 'Java Programming', platform: 'Udemy', url: '#' },
      { name: 'Aptitude Preparation', platform: 'Fresherworld', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Online Test Practice', description: 'Aptitude and technical', difficulty: 'Medium', duration: '90 mins', type: 'Aptitude', resourceUrl: '#' },
        { title: 'Coding Practice', description: 'Programming problems', difficulty: 'Hard', duration: '60 mins', type: 'Coding', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Technical Interview', description: 'Technical interview simulation', type: 'Technical', duration: '45 mins' },
        { title: 'Mock HR Interview', description: 'HR interview simulation', type: 'HR', duration: '30 mins' }
      ]
    },
    interviewTips: 'Prepare well for coding, aptitude, and be ready to discuss your projects in detail.',
    skills: ['Java', 'Python', 'Aptitude'],
    certifications: ['Cognizant Certification'],
    isActive: true
  }
];

// Add more mock companies to make it 36
for (let i = 6; i <= 36; i++) {
  mockCompanies.push({
    _id: `${i}`,
    name: `Company ${i}`,
    logo: '',
    description: `Description for Company ${i}`,
    detailedDescription: `Detailed description for Company ${i}. This company offers excellent opportunities for freshers with comprehensive training programs and career growth paths.`,
    requirements: 'Strong programming skills and good communication abilities.',
    importance: `Company ${i} is a great place to start your career with exposure to cutting-edge technologies.`,
    industry: 'IT Services',
    location: 'India',
    website: 'https://example.com',
    package: `${5 + Math.floor(Math.random() * 10)}-${10 + Math.floor(Math.random() * 15)} LPA`,
    visitDate: '2025-10-15',
    intake: 50 + Math.floor(Math.random() * 100),
    eligibility: {
      cgpa: 6.0 + Math.random() * 2,
      departments: ['CSE', 'ECE', 'EEE', 'IT'],
      year: 2025,
      backlogAllowed: Math.random() > 0.5,
      skills: ['Java', 'Python', 'Aptitude']
    },
    selectionProcess: [
      { round: 'Online Test', description: 'Aptitude and technical assessment', duration: '60 minutes' },
      { round: 'Technical Interview', description: 'Coding and technical discussion', duration: '45 minutes' },
      { round: 'HR Interview', description: 'Behavioral assessment', duration: '30 minutes' }
    ],
    roles: [
      { title: 'Software Engineer', department: 'Development', salaryPackage: '6-8 LPA' },
      { title: 'Systems Engineer', department: 'IT Services', salaryPackage: '7-9 LPA' }
    ],
    requiredCourses: [
      { name: 'Data Structures', platform: 'Coursera', url: '#' },
      { name: 'Java Programming', platform: 'Udemy', url: '#' }
    ],
    preparationMaterial: {
      practice: [
        { title: 'Aptitude Practice', description: 'Quantitative and logical reasoning', difficulty: 'Medium', duration: '60 mins', type: 'Aptitude', resourceUrl: '#' }
      ],
      mockInterviews: [
        { title: 'Mock Technical Interview', description: 'Technical interview simulation', type: 'Technical', duration: '45 mins' }
      ]
    },
    interviewTips: 'Prepare well for technical and aptitude rounds.',
    skills: ['Java', 'Python', 'Aptitude'],
    certifications: ['Company Certification'],
    isActive: true
  });
}

// Mock Tests
const mockTests = [
  {
    _id: '1',
    title: 'Python Basics Assessment',
    description: 'Test your fundamental Python programming skills',
    type: 'coding',
    duration: 30,
    instructions: 'Solve the following Python problems.',
    passingScore: 70,
    rounds: {
      coding: {
        enabled: true,
        duration: 30,
        questionCount: 1,
        languages: ['Python'],
        questions: [
          {
            id: 101,
            title: 'Sum of Even Numbers',
            description: 'Write a Python function that takes a list of numbers and returns the sum of all even numbers.',
            language: 'Python',
            starterCode: 'def sum_even(numbers):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '[1, 2, 3, 4, 5, 6]', expected: '12' },
              { input: '[2, 4, 6, 8]', expected: '20' }
            ]
          },
          {
            id: 102,
            title: 'Find Maximum Element',
            description: 'Write a Python function to find the maximum element in a list without using built-in max().',
            language: 'Python',
            starterCode: 'def find_max(numbers):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '[3, 1, 4, 1, 5]', expected: '5' },
              { input: '[10, 20, 30]', expected: '30' }
            ]
          },
          {
            id: 103,
            title: 'Reverse a String',
            description: 'Write a Python function to reverse a string without using slicing.',
            language: 'Python',
            starterCode: 'def reverse_string(text):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '"hello"', expected: '"olleh"' },
              { input: '"python"', expected: '"nohtyp"' }
            ]
          },
          {
            id: 104,
            title: 'Check Palindrome',
            description: 'Write a Python function to check if a string is a palindrome.',
            language: 'Python',
            starterCode: 'def is_palindrome(text):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '"radar"', expected: 'True' },
              { input: '"hello"', expected: 'False' }
            ]
          },
          {
            id: 105,
            title: 'Count Vowels',
            description: 'Write a Python function to count the number of vowels in a string.',
            language: 'Python',
            starterCode: 'def count_vowels(text):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '"hello world"', expected: '3' },
              { input: '"python"', expected: '1' }
            ]
          },
          {
            id: 106,
            title: 'Factorial',
            description: 'Write a Python function to calculate the factorial of a number.',
            language: 'Python',
            starterCode: 'def factorial(n):\n    # Your code here\n    pass',
            marks: 10,
            testCases: [
              { input: '5', expected: '120' },
              { input: '0', expected: '1' }
            ]
          }
        ],
        questionSets: {
          1: [
            {
              id: 101,
              title: 'Sum of Even Numbers',
              description: 'Write a Python function that takes a list of numbers and returns the sum of all even numbers.',
              language: 'Python',
              starterCode: 'def sum_even(numbers):\n    # Your code here\n    pass',
              marks: 10
            },
            {
              id: 104,
              title: 'Check Palindrome',
              description: 'Write a Python function to check if a string is a palindrome.',
              language: 'Python',
              starterCode: 'def is_palindrome(text):\n    # Your code here\n    pass',
              marks: 10
            }
          ],
          2: [
            {
              id: 102,
              title: 'Find Maximum Element',
              description: 'Write a Python function to find the maximum element in a list without using built-in max().',
              language: 'Python',
              starterCode: 'def find_max(numbers):\n    # Your code here\n    pass',
              marks: 10
            },
            {
              id: 105,
              title: 'Count Vowels',
              description: 'Write a Python function to count the number of vowels in a string.',
              language: 'Python',
              starterCode: 'def count_vowels(text):\n    # Your code here\n    pass',
              marks: 10
            }
          ],
          3: [
            {
              id: 103,
              title: 'Reverse a String',
              description: 'Write a Python function to reverse a string without using slicing.',
              language: 'Python',
              starterCode: 'def reverse_string(text):\n    # Your code here\n    pass',
              marks: 10
            },
            {
              id: 106,
              title: 'Factorial',
              description: 'Write a Python function to calculate the factorial of a number.',
              language: 'Python',
              starterCode: 'def factorial(n):\n    # Your code here\n    pass',
              marks: 10
            }
          ]
        }
      }
    },
    proctoring: {
      enableWebcam: true,
      enableScreenRecording: true,
      enableTabSwitchDetection: true,
      enableFullscreen: true,
      allowCopyPaste: false,
      allowRightClick: false
    },
    settings: {
      shuffleQuestions: false,
      shuffleOptions: false,
      showResultsImmediately: true,
      allowReview: true,
      maxAttempts: 3
    }
  },
  {
    _id: '2',
    title: 'Quantitative Aptitude Test',
    description: 'Test your mathematical and logical reasoning skills',
    type: 'aptitude',
    duration: 20,
    instructions: 'Answer the following multiple choice questions.',
    passingScore: 60,
    rounds: {
      aptitude: {
        enabled: true,
        duration: 20,
        questionCount: 3,
        questions: [
          {
            id: 201,
            question: 'If 3x + 5 = 20, what is the value of x?',
            type: 'multiple-choice',
            marks: 5,
            options: ['3', '5', '7', '15'],
            correctAnswer: 1
          },
          {
            id: 202,
            question: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
            type: 'multiple-choice',
            marks: 5,
            options: ['38', '40', '42', '44'],
            correctAnswer: 2
          },
          {
            id: 203,
            question: 'A train travels at 60 km/h. How far will it travel in 15 minutes?',
            type: 'multiple-choice',
            marks: 5,
            options: ['10 km', '15 km', '20 km', '25 km'],
            correctAnswer: 1
          },
          {
            id: 204,
            question: 'What is 25% of 80?',
            type: 'multiple-choice',
            marks: 5,
            options: ['15', '20', '25', '30'],
            correctAnswer: 1
          },
          {
            id: 205,
            question: 'If a square has area 64 sq units, what is its perimeter?',
            type: 'multiple-choice',
            marks: 5,
            options: ['16', '24', '32', '48'],
            correctAnswer: 2
          },
          {
            id: 206,
            question: 'What is the average of 12, 18, 24, and 30?',
            type: 'multiple-choice',
            marks: 5,
            options: ['18', '20', '21', '24'],
            correctAnswer: 2
          }
        ],
        questionSets: {
          1: [
            {
              id: 201,
              question: 'If 3x + 5 = 20, what is the value of x?',
              type: 'multiple-choice',
              marks: 5,
              options: ['3', '5', '7', '15'],
              correctAnswer: 1
            },
            {
              id: 202,
              question: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
              type: 'multiple-choice',
              marks: 5,
              options: ['38', '40', '42', '44'],
              correctAnswer: 2
            },
            {
              id: 203,
              question: 'A train travels at 60 km/h. How far will it travel in 15 minutes?',
              type: 'multiple-choice',
              marks: 5,
              options: ['10 km', '15 km', '20 km', '25 km'],
              correctAnswer: 1
            }
          ],
          2: [
            {
              id: 211,
              question: 'What is 25% of 80?',
              type: 'multiple-choice',
              marks: 5,
              options: ['15', '20', '25', '30'],
              correctAnswer: 1
            },
            {
              id: 212,
              question: 'If a square has area 64 sq units, what is its perimeter?',
              type: 'multiple-choice',
              marks: 5,
              options: ['16', '24', '32', '48'],
              correctAnswer: 2
            },
            {
              id: 213,
              question: 'What is the average of 12, 18, 24, and 30?',
              type: 'multiple-choice',
              marks: 5,
              options: ['18', '20', '21', '24'],
              correctAnswer: 2
            }
          ],
          3: [
            {
              id: 221,
              question: 'If 2x + 8 = 20, what is x?',
              type: 'multiple-choice',
              marks: 5,
              options: ['4', '6', '8', '10'],
              correctAnswer: 1
            },
            {
              id: 222,
              question: 'What is the HCF of 24 and 36?',
              type: 'multiple-choice',
              marks: 5,
              options: ['6', '8', '12', '18'],
              correctAnswer: 2
            },
            {
              id: 223,
              question: 'If 5 workers complete a job in 12 days, how long will 6 workers take?',
              type: 'multiple-choice',
              marks: 5,
              options: ['8 days', '10 days', '12 days', '15 days'],
              correctAnswer: 1
            }
          ]
        }
      }
    },
    questions: [
      {
        question: 'If 3x + 5 = 20, what is the value of x?',
        type: 'multiple-choice',
        points: 5,
        difficulty: 'Easy',
        options: [
          { option: '3', isCorrect: false },
          { option: '5', isCorrect: true },
          { option: '7', isCorrect: false },
          { option: '9', isCorrect: false }
        ],
        correctAnswer: '5',
        explanation: '3x + 5 = 20 => 3x = 15 => x = 5'
      }
    ],
    proctoring: {
      enableWebcam: true,
      enableScreenRecording: true,
      enableTabSwitchDetection: true,
      enableFullscreen: true,
      allowCopyPaste: false,
      allowRightClick: false
    },
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
      showResultsImmediately: true,
      allowReview: false,
      maxAttempts: 2
    }
  }
];

// Mock Services
export const mockAuthService = {
  login: async (rollNumber, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.rollNumber === rollNumber && u.password === password);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + user._id
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          _id: String(mockUsers.length + 1),
          isAdmin: false
        };
        mockUsers.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        resolve({
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + newUser._id
        });
      }, 500);
    });
  },

  verify: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: mockUsers[0] });
      }, 500);
    });
  }
};

export const mockCompanyService = {
  getAllCompanies: async () => {
    return new Promise((resolve) => {
      resolve(mockCompanies);
    });
  },

  getCompanyById: async (id) => {
    return new Promise((resolve, reject) => {
      const company = mockCompanies.find(c => c._id === id);
      if (company) {
        resolve(company);
      } else {
        reject(new Error('Company not found'));
      }
    });
  }
};

export const mockTestService = {
  getAllTests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTests);
      }, 500);
    });
  },

  getTestById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const test = mockTests.find(t => t._id === id);
        if (test) {
          resolve(test);
        } else {
          reject(new Error('Test not found'));
        }
      }, 500);
    });
  }
};

// Mock Profile Service
export const mockProfileService = {
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: '2',
          name: 'John Doe',
          rollNumber: '23761A05M9',
          email: 'john@college.edu',
          phoneNumber: '9876543210',
          github: 'https://github.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          department: 'CSE',
          year: 3,
          profile: {
            education: {
              cgpa: 8.5,
              backlogs: 0,
              backlogSemesters: ''
            },
            codingProfiles: {
              leetcode: 'https://leetcode.com/johndoe',
              hackerrank: 'https://hackerrank.com/johndoe',
              codechef: 'https://codechef.com/users/johndoe',
              smartinterviews: '',
              skelo: ''
            },
            projects: [
              { id: 1, title: 'E-commerce Website', language: 'MERN Stack', githubLink: 'https://github.com/johndoe/ecommerce' },
              { id: 2, title: 'Task Management App', language: 'React + Node.js', githubLink: 'https://github.com/johndoe/taskapp' }
            ],
            skills: {
              languages: ['Python', 'Java', 'JavaScript'],
              languageLevels: ['Intermediate', 'Beginner', 'Advanced'],
              tools: ['Git', 'VS Code', 'Postman'],
              roles: ['Software Engineer', 'Full Stack Developer'],
              apps: ['React', 'Node.js', 'Express']
            },
            certifications: [
              { name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2024-01-15', certificateUrl: '#' },
              { name: 'Python Certification', issuer: 'Google', date: '2023-08-20', certificateUrl: '#' }
            ],
            documents: {
              resume: null,
              idCard: null,
              intermediateMarks: null,
              tenthMarks: null
            }
          },
          updatedAt: new Date().toISOString()
        });
      }, 500);
    });
  },

  updateProfile: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Profile updated successfully' });
      }, 500);
    });
  },

  updateProjects: async (projects) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Projects updated successfully' });
      }, 500);
    });
  },

  updateEducation: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Education updated successfully' });
      }, 500);
    });
  },

  updateCodingProfiles: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Coding profiles updated successfully' });
      }, 500);
    });
  },

  updateSkills: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Skills updated successfully' });
      }, 500);
    });
  },

  updatePlacement: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Placement status updated' });
      }, 500);
    });
  },

  updateSkillsCertifications: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Skills updated successfully' });
      }, 500);
    });
  },

  updateDocuments: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Documents updated successfully' });
      }, 500);
    });
  }
};

const mockServices = {
  mockUsers,
  mockCompanies,
  mockTests,
  mockAuthService,
  mockCompanyService,
  mockTestService,
  mockProfileService
};

export default mockServices;
