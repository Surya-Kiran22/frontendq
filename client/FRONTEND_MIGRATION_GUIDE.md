# Frontend Migration to Backend API Guide

## Completed Work

### 1. Backend Server Created
- **Location**: `server/` directory
- **Database**: MongoDB with complete schema
- **File Storage**: AWS S3 integration
- **Authentication**: JWT-based with role-based access
- **API Endpoints**: All core endpoints implemented

### 2. API Service Files Created
- **Location**: `client/src/services/`
- **Files Created**:
  - `api.js` - Axios configuration with interceptors
  - `authService.js` - Authentication API calls
  - `companyService.js` - Company management API calls
  - `testService.js` - Test management API calls
  - `profileService.js` - Profile management API calls

### 3. Components Updated to Use Backend APIs
- **AuthContext.js** - Updated to use authService
- **Companies.js** - Updated to use companyService
- **CompanyDetail.js** - Updated to use companyService
- **Profile.js** - Partially updated (import changed, methods need updating)

## Remaining Work

### 1. Install Axios
```bash
cd client
npm install axios
```

### 2. Update .env File
Create or update `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Update Profile Component
The Profile component has many method calls that need to be updated to use the new API. The current profileService has these methods:
- `getProfile()` - Get current user profile
- `createOrUpdateProfile(profileData)` - Create or update profile
- `uploadDocument(file, documentType)` - Upload document
- `getAllProfiles()` - Get all profiles (admin only)
- `getProfileByUserId(userId)` - Get profile by user ID (admin only)

**Profile.js needs these updates:**

Replace these method calls:
```javascript
// OLD
const data = await mockProfileService.getProfile();
// NEW
const data = await profileService.getProfile();

// OLD
await mockProfileService.updateProfile(updateData);
// NEW
await profileService.createOrUpdateProfile(updateData);

// OLD
await mockProfileService.updateProjects(updatedProjects);
// NEW
await profileService.createOrUpdateProfile({ projects: updatedProjects });

// OLD
await mockProfileService.updateEducation(updateData);
// NEW
await profileService.createOrUpdateProfile({ education: updateData });

// OLD
await mockProfileService.updateCodingProfiles(updateData);
// NEW
await profileService.createOrUpdateProfile({ codingProfiles: updateData });

// OLD
await mockProfileService.updateSkills(updateData);
// NEW
await profileService.createOrUpdateProfile({ skills: updateData });

// OLD
await mockProfileService.updateSkillsCertifications({ certifications: updatedCerts });
// NEW
await profileService.createOrUpdateProfile({ certifications: updatedCerts });

// OLD
await mockProfileService.updateDocuments(updatedDocuments);
// NEW
await profileService.createOrUpdateProfile({ documents: updatedDocuments });
```

### 4. Update OnlineTest Component
**File**: `client/src/pages/student/OnlineTest.js`

Replace import:
```javascript
// OLD
import { mockTestService } from '../../services/mockData';
// NEW
import { testService } from '../../services/testService';
```

Replace method calls:
```javascript
// OLD
const testData = await mockTestService.getTestById(testId);
// NEW
const testData = await testService.getTestById(testId);

// OLD
const result = await mockTestService.submitTest(testId, submissionData);
// NEW
const result = await testService.submitTest(testId, submissionData);
```

### 5. Update Tests Component
**File**: `client/src/pages/student/Tests.js`

Replace import:
```javascript
// OLD
import { mockTestService } from '../../services/mockData';
// NEW
import { testService } from '../../services/testService';
```

Replace method calls:
```javascript
// OLD
const tests = await mockTestService.getAllTests();
// NEW
const tests = await testService.getAllTests();
```

### 6. Update Dashboard Component
**File**: `client/src/pages/student/Dashboard.js`

Replace imports:
```javascript
// OLD
import { mockCompanyService, mockTestService } from '../../services/mockData';
// NEW
import { companyService } from '../../services/companyService';
import { testService } from '../../services/testService';
```

Replace method calls accordingly.

### 7. Update Admin Components
The following admin components need similar updates:
- `client/src/pages/admin/Dashboard.js`
- `client/src/pages/admin/Companies.js`
- `client/src/pages/admin/Students.js`
- `client/src/pages/admin/TestCreator.js`
- `client/src/pages/admin/Tracking.js`

Each should replace mock data imports with the corresponding service imports and method calls.

### 8. Update Other Components
- `client/src/pages/student/Applications.js`
- `client/src/pages/student/ResumeAnalyzer.js`
- `client/src/pages/student/AIInterview.js`
- `client/src/components/Layout.js`

### 9. Remove mockData.js
After all components are updated, delete:
```bash
rm client/src/services/mockData.js
```

## Backend Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/placement-system
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=placement-system-bucket
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongodb
```

### 4. Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing the Migration

### 1. Start Backend Server
```bash
cd server
npm run dev
```

### 2. Start Frontend
```bash
cd client
npm start
```

### 3. Test Authentication
- Try logging in with existing credentials
- The backend will need initial admin user creation

### 4. Create Initial Admin User
You can create an admin user via the registration endpoint or directly in MongoDB:
```javascript
// In MongoDB shell
db.users.insertOne({
  name: 'Admin User',
  rollNumber: '77688',
  email: 'admin@college.edu',
  password: '$2a$10$hash', // Hashed password for 'surya77688'
  role: 'admin',
  department: 'CSE',
  year: 4,
  cgpa: 9.5,
  isAdmin: true,
  isActive: true
})
```

## API Endpoint Reference

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get current user profile

### Companies
- `GET /api/companies` - Get all companies (filtered by user's department)
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company (admin only)
- `PUT /api/companies/:id` - Update company (admin only)
- `DELETE /api/companies/:id` - Delete company (admin only)
- `GET /api/companies/mappings` - Get branch mappings (admin only)
- `PUT /api/companies/:id/branch-mapping` - Update branch mapping (admin only)

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create test (admin only)
- `PUT /api/tests/:id` - Update test (admin only)
- `DELETE /api/tests/:id` - Delete test (admin only)
- `POST /api/tests/:id/submit` - Submit test answers
- `GET /api/tests/results` - Get test results for current user
- `GET /api/tests/results/:id` - Get test result by ID

### Profiles
- `GET /api/profiles` - Get current user profile
- `POST /api/profiles` - Create or update profile
- `POST /api/profiles/upload` - Upload document
- `GET /api/profiles/all` - Get all profiles (admin only)
- `GET /api/profiles/user/:userId` - Get profile by user ID (admin only)

## Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure:
1. Backend `CLIENT_URL` in `.env` matches frontend URL
2. Frontend `REACT_APP_API_URL` in `.env` matches backend URL
3. Backend CORS configuration is correct in `server/src/server.js`

### Authentication Errors
If authentication fails:
1. Check JWT_SECRET in backend `.env`
2. Ensure token is being stored in localStorage
3. Check browser console for error messages

### MongoDB Connection Errors
If MongoDB fails to connect:
1. Ensure MongoDB is running
2. Check MONGODB_URI in backend `.env`
3. Verify MongoDB credentials if using authentication

## Next Steps

1. Complete updating all remaining components to use backend APIs
2. Test the application thoroughly
3. Set up AWS S3 bucket for file storage
4. Deploy backend server (Heroku, Render, AWS, etc.)
5. Update production environment variables
6. Remove mockData.js from frontend
7. Commit and push changes to GitHub
