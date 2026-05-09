# Full Implementation Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git
- AWS Account (for S3 storage - optional for development)

## Step 1: Install Dependencies

### Backend Dependencies
```bash
cd server
npm install
```

### Frontend Dependencies
```bash
cd client
npm install
```

## Step 2: Configure Environment Variables

### Server Configuration
1. Copy `server/.env.example` to `server/.env`
2. Update the following variables:
   - `PORT`: Backend server port (default: 5000)
   - `NODE_ENV`: development or production
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens (minimum 32 characters)
   - `JWT_EXPIRE`: Token expiration time (default: 7d)
   - `AWS_ACCESS_KEY_ID`: AWS access key (for S3)
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key (for S3)
   - `AWS_REGION`: AWS region (default: us-east-1)
   - `AWS_S3_BUCKET`: S3 bucket name
   - `CLIENT_URL`: Frontend URL (default: http://localhost:3000)

### Client Configuration
1. Copy `client/.env.example` to `client/.env`
2. Update the following variables:
   - `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Step 3: Start MongoDB

### Option 1: Local MongoDB Installation
```bash
# Start MongoDB service
# Windows: Run MongoDB as a service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in server/.env

## Step 4: Seed Database with Initial Data

```bash
cd server
node src/seed.js
```

This will create:
- 1 admin user (rollNumber: 77688, password: surya77688)
- 10 student users (rollNumber: 23761A05XX, password: password123)
- 5 sample companies (TCS, Infosys, Wipro, Amazon, Microsoft)
- 2 sample tests (Aptitude, Technical Assessment)

## Step 5: Start the Backend Server

```bash
cd server
npm start
```

The server will start on port 5000 (or your configured port).
You should see: `Server running in development mode on port 5000`

## Step 6: Start the Frontend Development Server

```bash
cd client
npm start
```

The frontend will start on port 3000.
Open http://localhost:3000 in your browser.

## Step 7: Test the Application

### Admin Login
- Roll Number: `77688`
- Password: `surya77688`

### Student Login
- Roll Number: `23761A0501` to `23761A0510`
- Password: `password123`

### Test Features
1. **Authentication**: Login and register new users
2. **Companies**: Browse and view company details
3. **Tests**: Take online tests
4. **Profile**: Update student profile
5. **Compiler**: Test code compilation
6. **AI Interview**: Practice interviews
7. **Resume Analyzer**: Analyze resume

## Step 8: Production Deployment

### Backend Deployment
1. Deploy MongoDB (MongoDB Atlas recommended)
2. Update environment variables for production
3. Deploy backend to:
   - Heroku
   - Render.com
   - AWS EC2
   - DigitalOcean
   - Or any Node.js hosting platform

### Frontend Deployment
1. Update `REACT_APP_API_URL` to production backend URL
2. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
3. Deploy the `build` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

### AWS S3 Setup (for file uploads)
1. Create an S3 bucket
2. Configure CORS policy
3. Create IAM user with S3 permissions
4. Update AWS credentials in server/.env

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in server/.env
- Verify MongoDB authentication if required

### Port Already in Use
- Change PORT in server/.env
- Change frontend port by modifying start script in client/package.json

### CORS Error
- Ensure CLIENT_URL in server/.env matches your frontend URL
- Check browser console for specific CORS errors

### Module Not Found
- Run `npm install` in both server and client directories
- Delete node_modules and package-lock.json, then reinstall

### Environment Variables Not Loading
- Ensure .env files exist in both server and client
- Restart the server after changing .env files
- Check variable names match exactly (case-sensitive)

## Development Tips

### Hot Reload
- Backend: Use `nodemon` for automatic restart on changes
- Frontend: React has built-in hot reload

### Debugging
- Backend: Use `console.log` or a debugger
- Frontend: Use browser DevTools (F12)

### Database Management
- Use MongoDB Compass for GUI database management
- Or use Robo 3T / Studio 3T

## Security Notes

1. **Never commit .env files** - They contain sensitive information
2. **Change JWT_SECRET** in production
3. **Use strong passwords** for all accounts
4. **Enable HTTPS** in production
5. **Configure proper CORS** for production domains
6. **Implement rate limiting** (already configured)
7. **Use helmet.js** (already configured)
8. **Validate all inputs** (already configured)

## Support

For issues or questions:
1. Check the server logs for backend errors
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Check environment variables
5. Ensure all dependencies are installed

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Companies
- GET `/api/companies` - Get all companies
- GET `/api/companies/:id` - Get company by ID
- POST `/api/companies` - Create company (admin only)
- PUT `/api/companies/:id` - Update company (admin only)
- DELETE `/api/companies/:id` - Delete company (admin only)

### Tests
- GET `/api/tests` - Get all tests
- GET `/api/tests/:id` - Get test by ID
- POST `/api/tests` - Create test (admin only)
- PUT `/api/tests/:id` - Update test (admin only)
- DELETE `/api/tests/:id` - Delete test (admin only)
- POST `/api/tests/:id/submit` - Submit test answers
- GET `/api/tests/:id/results` - Get test results

### Profiles
- GET `/api/profiles` - Get current user profile
- POST `/api/profiles` - Create/update profile
- POST `/api/profiles/upload` - Upload document
- GET `/api/profiles/all` - Get all profiles (admin only)
- GET `/api/profiles/user/:userId` - Get profile by user ID (admin only)

### Compiler
- POST `/api/compiler/compile` - Compile code

### AI Interview
- GET `/api/ai-interview/placement-status` - Check placement status
- POST `/api/ai-interview/submit` - Submit interview

### Resume Analyzer
- POST `/api/resume-analyzer/analyze` - Analyze resume

## Project Structure

```
project-2/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Authentication middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── seed.js        # Database seeding script
│   │   └── server.js      # Main server file
│   ├── .env.example       # Environment variables template
│   └── package.json       # Backend dependencies
│
└── client/                 # Frontend React App
    ├── public/            # Static files
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── contexts/      # React contexts
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   └── App.js         # Main App component
    ├── .env.example       # Environment variables template
    └── package.json       # Frontend dependencies
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- AWS S3
- JWT
- Bcryptjs

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Heroicons
- React Hot Toast

## License

MIT
