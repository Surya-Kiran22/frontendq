# 🚀 Placement Preparation System - Frontend Only

A beautiful, modern React application for managing campus placements, student preparation, and application tracking. This is a **standalone frontend application** with mock data, perfect for demonstrations and UI/UX showcasing.

## ✨ Features

### 🎨 Modern UI/UX:
- **Attractive Gradient Design** - Beautiful color schemes with glassmorphism effects
- **Smooth Animations** - Fade-ins, slide-ups, and hover effects
- **Responsive Layout** - Works perfectly on all devices
- **Modern Components** - Cards, buttons, badges with shadows and gradients

### 🔐 Authentication:
- **Login**: Roll number format (23761A05M9) and password
- **Admin Access**: Special credentials (77688/surya77688)
- **Mock Data**: All data is pre-loaded, no backend needed!

### 📊 For Students:
- **Company Browser**: View 36 companies with detailed information
- **Practice Materials**: Company-specific aptitude and coding practice
- **Mock Interviews**: Interview questions and tips
- **Skills & Certifications**: Required skills for each company
- **Application Tracking**: Track applications across companies
- **Profile Management**: Personal info, skills, placement status

### 👨‍💼 For Admins:
- **Dashboard**: Statistics and recent activities
- **Company Management**: View and manage companies
- **Student Management**: View student records
- **Analytics**: Visual charts and statistics

## 🛠️ Technology Stack

### Frontend:
- **React 18** - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications
- **Recharts** - Data visualizations
- **Headless UI** - Accessible components

### Design Features:
- 🎨 **Gradient Backgrounds** - Modern color transitions
- ✨ **Glassmorphism** - Frosted glass effects
- 🌈 **Gradient Text** - Beautiful typography
- 💫 **Smooth Animations** - Enhanced user experience
- 📱 **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
placement-preparation-frontend/
├── client/                     # Frontend application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts (AuthContext with mock data)
│   │   ├── pages/             # Page components
│   │   │   ├── student/       # Student pages
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Companies.js
│   │   │   │   ├── CompanyDetail.js
│   │   │   │   ├── Profile.js
│   │   │   │   ├── Applications.js
│   │   │   │   ├── Tests.js
│   │   │   │   └── OnlineTest.js
│   │   │   └── admin/         # Admin pages
│   │   │       ├── Dashboard.js
│   │   │       ├── Companies.js
│   │   │       ├── Students.js
│   │   │       └── Tracking.js
│   │   ├── services/          # Mock data services
│   │   │   └── mockData.js    # All mock data for the app
│   │   ├── App.js             # Main app component
│   │   ├── index.css          # Enhanced styles with gradients
│   │   └── index.js           # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json               # Root package.json (frontend only)
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Step 1: Navigate to Project
```bash
cd placement-preparation-system
```

### Step 2: Install Dependencies
```bash
npm install
```

#### Install client dependencies:
```bash
cd client && npm install
```

### Step 3: Start the Application

Since this is a standalone frontend application with mock data, simply run:

```bash
npm start
```

Or directly from the client folder:
```bash
cd client && npm start
```

The application will open automatically at **http://localhost:3000** 🎉
### Step 4: Login Credentials

Since this is a frontend-only application with **mock data**, use these credentials:

**🔐 Admin Login:**
- **Roll Number:** `77688`
- **Password:** `surya77688`

**👤 Student Login:**
- **Roll Number:** `23761A05M9`
- **Password:** `password123`

**✨ Or register as a new student** - all data is stored locally in memory!

## 📊 Sample Companies Included

The system includes data for 36 companies:

### IT & Software:
- TCS, ACCENTURE, TECH MAHINDRA
- CDK GLOBAL, SNOVASYS, SKANDA
- MSEUARE, GEM

### Consulting & Services:
- DELOITTE, MIRACLE, EECLAT
- KISAAI, DELTAX

### Banking & Finance:
- HOMEFIRST, HDB, KOTAK

### Manufacturing & Engineering:
- KYB, IMEG, SKANDA

### Others:
- SNOVASYS, [24]7.AI, KISAAI
- And many more...

## 🔐 Authentication System

### Student Authentication:
- **Roll Number Format**: 23761A05M9 (5 digits + 1 letter + 2 digits + 1 letter + 1 digit)
- **Password**: Minimum 6 characters
- **Fields Required**: Name, Email, Branch, Year, Phone Number

### Admin Authentication:
- **Special Roll Number**: 77688
- **Special Password**: surya77688
- **Privileges**: Full access to all features

## 📱 Available Scripts

### Root Directory:
```bash
npm start          # Start production server
npm run dev        # Start development mode (concurrently)
npm run server     # Start server only
npm run client     # Start client only
npm run build      # Build client for production
```

### Server Directory:
```bash
node server/scripts/seedDatabase.js           # Seed database
node server/scripts/seedDatabase.js --force   # Force reseed
node server/scripts/seedDatabase.js --with-samples  # With sample data
```

## 🔧 API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login (student or admin)
- `GET /api/auth/verify` - Verify JWT token

### Companies (Student):
- `GET /api/companies` - Get all active companies
- `GET /api/companies/:id` - Get company details
- `GET /api/companies/:id/practice` - Get practice materials
- `GET /api/companies/:id/mock-interviews` - Get mock interviews
- `POST /api/companies/:id/track` - Track application

### Students:
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update profile
- `PUT /api/students/profile/skills-certifications` - Update skills
- `GET /api/students/applications` - Get application history
- `GET /api/students/statistics` - Get student statistics

### Admin:
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/students` - Get all students
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/companies` - Get all companies
- `POST /api/admin/companies` - Create company
- `PUT /api/admin/companies/:id` - Update company
- `DELETE /api/admin/companies/:id` - Delete company
- `GET /api/admin/tracking` - Get all tracking data
- `GET /api/admin/statistics` - Get placement statistics

## 🎨 UI/UX Features

### Modern Design:
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent iconography
- **Toast Notifications**: User-friendly feedback
- **Loading States**: Smooth loading animations

### Student Interface:
- Clean dashboard with statistics
- Company cards with filtering and search
- Tabbed company details (Overview, Practice, Mock Interviews, Skills)
- Application tracking with status updates
- Profile management with skills and certifications

### Admin Interface:
- Comprehensive dashboard with analytics
- Data tables with pagination and filtering
- Charts and visualizations
- CRUD operations for companies and students
- Statistics and reporting

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs with salt rounds
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevent abuse with rate limiting
- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin policies

## 🌐 Deployment

### Prerequisites for Deployment:
1. Set up MongoDB Atlas cluster
2. Configure environment variables for production
3. Set up a cloud server (AWS, Heroku, DigitalOcean, etc.)

### Build for Production:
```bash
npm run build
```

### Production Environment Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_system
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://yourdomain.com
```

### Deploy to Heroku:
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
git push heroku main
```

## 📝 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Check MONGODB_URI in .env
   - Verify IP whitelist in MongoDB Atlas
   - Check network connectivity

2. **JWT Token Issues**:
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify Authorization header format

3. **Client-Server Communication**:
   - Check CORS configuration
   - Verify ports (3000 for client, 5000 for server)
   - Check proxy settings in client/package.json

4. **Module Not Found Errors**:
   - Run `npm install` in both root and client directories
   - Check Node.js version (should be 14+)

5. **Tailwind CSS Not Working**:
   - Ensure postcss.config.js is present
   - Check tailwind.config.js content paths
   - Restart the development server

### Support:
- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas cluster is active

## 🎓 Learning Resources

### For Students Using This System:
- Focus on aptitude and technical skills
- Practice coding on platforms like LeetCode, HackerRank
- Prepare for company-specific interviews
- Track your applications and follow up
- Keep your profile updated with skills and certifications

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- React and Node.js communities
- All open-source contributors

---

## 📞 Contact

For questions or support, please reach out to the development team.

**Happy Placement Preparation! 🎓✨**
