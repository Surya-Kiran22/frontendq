# Placement System Backend Server

Backend API server for Placement Tracking System with MongoDB database and AWS S3 file storage.

## Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   └── aws.js               # AWS S3 configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic (login, register)
│   │   ├── companyController.js # Company management logic
│   │   ├── testController.js    # Test management and submission logic
│   │   └── profileController.js # Profile management and document upload
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model schema
│   │   ├── Profile.js           # Profile model schema
│   │   ├── Company.js           # Company model schema
│   │   ├── Test.js              # Test model schema
│   │   ├── TestResult.js        # Test result model schema
│   │   └── Application.js       # Job application model schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── companyRoutes.js     # Company endpoints
│   │   ├── testRoutes.js        # Test endpoints
│   │   └── profileRoutes.js     # Profile endpoints
│   ├── services/                # Additional services (if needed)
│   ├── utils/                   # Utility functions (if needed)
│   └── server.js                # Main server entry point
├── uploads/                     # Temporary file upload directory
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete database schema documentation.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- AWS Account with S3 access

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
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

5. Start MongoDB server:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongodb
# or
mongod
```

6. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Companies

- `GET /api/companies` - Get all companies (protected, filtered by user's department for students)
- `GET /api/companies/mappings` - Get all company-branch mappings (admin only)
- `GET /api/companies/:id` - Get company by ID (protected)
- `POST /api/companies` - Create new company (admin only)
- `PUT /api/companies/:id` - Update company (admin only)
- `DELETE /api/companies/:id` - Delete company (admin only)
- `PUT /api/companies/:id/branch-mapping` - Update company-branch mapping (admin only)

### Tests

- `GET /api/tests` - Get all tests (protected)
- `GET /api/tests/results` - Get test results for current user (protected)
- `GET /api/tests/results/:id` - Get test result by ID (protected)
- `GET /api/tests/:id` - Get test by ID (protected)
- `POST /api/tests` - Create new test (admin only)
- `PUT /api/tests/:id` - Update test (admin only)
- `DELETE /api/tests/:id` - Delete test (admin only)
- `POST /api/tests/:id/submit` - Submit test answers (protected)

### Profiles

- `GET /api/profiles` - Get current user profile (protected)
- `POST /api/profiles` - Create or update profile (protected)
- `POST /api/profiles/upload` - Upload document (protected)
- `GET /api/profiles/all` - Get all profiles (admin only)
- `GET /api/profiles/user/:userId` - Get profile by user ID (admin only)

## AWS S3 Setup

### Create S3 Bucket

1. Go to AWS Console → S3
2. Create a new bucket with a unique name
3. Enable public read access for the bucket
4. Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Folder Structure in S3

The server automatically organizes files in S3 with the following structure:

```
placement-system-bucket/
├── documents/
│   └── resumes/
│       └── {userId}/resume_{timestamp}.pdf
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation

## Development

### Run in Development Mode
```bash
npm run dev
```

The server will automatically restart when files change.

### Run Tests
```bash
npm test
```

## Deployment

### Environment Variables

Make sure to set the following environment variables in production:

- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, random secret key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - Production S3 bucket name
- `CLIENT_URL` - Frontend production URL

### Deployment Platforms

This server can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Render.com
- Any Node.js hosting platform

## License

ISC
