import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layout Components
import Layout from './components/Layout';

// Auth Components
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import Companies from './pages/student/Companies';
import CompanyDetail from './pages/student/CompanyDetail';
import Profile from './pages/student/Profile';
import Applications from './pages/student/Applications';
import Tests from './pages/student/Tests';
import OnlineTest from './pages/student/OnlineTest';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import Compiler from './pages/student/Compiler';
import AIInterview from './pages/student/AIInterview';
import TestResults from './pages/student/TestResults';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCompanies from './pages/admin/Companies';
import AdminStudents from './pages/admin/Students';
import AdminTracking from './pages/admin/Tracking';
import AdminStatistics from './pages/admin/Statistics';
import TestCreator from './pages/admin/TestCreator';
import ReportGenerator from './pages/admin/ReportGenerator';
import CompanyBranchManager from './pages/admin/CompanyBranchManager';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Student Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:id" element={<CompanyDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="applications" element={<Applications />} />
              <Route path="tests" element={<Tests />} />
              <Route path="test/:testId" element={<OnlineTest />} />
              <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="compiler" element={<Compiler />} />
              <Route path="ai-interview" element={<AIInterview />} />
              <Route path="test-results/:testId" element={<TestResults />} />
            </Route>
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="tracking" element={<AdminTracking />} />
              <Route path="statistics" element={<AdminStatistics />} />
              <Route path="test-creator" element={<TestCreator />} />
              <Route path="report-generator" element={<ReportGenerator />} />
              <Route path="company-branch-manager" element={<CompanyBranchManager />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
