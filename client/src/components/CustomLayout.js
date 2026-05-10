import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './ui/Navigation';

const CustomLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if current page is an exam page
  const isExamPage = location.pathname.startsWith('/test/');

  const handleLogout = () => {
    // This would be handled by AuthContext
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
      {/* Hide sidebar on exam pages */}
      {!isExamPage && (
        <>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-neutral-200 lg:hidden"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-neutral-600 rounded-full"></div>
              <div className="w-6 h-0.5 bg-neutral-600 rounded-full"></div>
              <div className="w-6 h-0.5 bg-neutral-600 rounded-full"></div>
            </div>
          </button>

          {/* Sidebar */}
          <Navigation />
        </>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isExamPage 
          ? 'lg:ml-0' 
          : 'lg:ml-64'
      }`}>
        <div className="min-h-screen">
          <div className="bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm">
                  <Link 
                    to="/" 
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    🏠 Home
                  </Link>
                  <span className="text-neutral-400">/</span>
                  {location.pathname !== '/' && (
                    <span className="text-neutral-700 font-medium">
                      {location.pathname.split('/').pop() || 'Dashboard'}
                    </span>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {user?.isAdmin ? 'Administrator' : user?.rollNumber || 'Student'}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m2 4h13a2 2 0 012-2 2 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h13a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
        .sidebar-collapsed {
          transform: translateX(-100%);
        }
        @media (min-width: 1024px) {
          .sidebar-collapsed {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomLayout;
