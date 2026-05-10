import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UserIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStudents, setActiveStudents] = useState(0);
  
  // Check if current page is an exam page
  const isExamPage = location.pathname.startsWith('/online-test/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const studentNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500' },
    { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon, color: 'from-emerald-500 to-teal-500' },
    { name: 'Tests', href: '/tests', icon: ClipboardDocumentListIcon, color: 'from-violet-500 to-purple-500' },
    { name: 'Applications', href: '/applications', icon: DocumentTextIcon, color: 'from-amber-500 to-orange-500' },
    { name: 'Payment', href: '/payment', icon: CreditCardIcon, color: 'from-indigo-500 to-purple-500' },
    { name: 'Profile', href: '/profile', icon: UserIcon, color: 'from-rose-500 to-pink-500' },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, color: 'from-blue-500 to-cyan-500' },
    { name: 'Companies', href: '/admin/companies', icon: BuildingOfficeIcon, color: 'from-emerald-500 to-teal-500' },
    { name: 'Students', href: '/admin/students', icon: UsersIcon, color: 'from-violet-500 to-purple-500' },
    { name: 'Payments', href: '/admin/payments', icon: CreditCardIcon, color: 'from-indigo-500 to-purple-500' },
    { name: 'Test Creator', href: '/admin/test-creator', icon: ClipboardDocumentListIcon, color: 'from-green-500 to-emerald-500' },
    { name: 'Report Generator', href: '/admin/report-generator', icon: DocumentTextIcon, color: 'from-purple-500 to-indigo-500' },
    { name: 'Branch Manager', href: '/admin/company-branch-manager', icon: AcademicCapIcon, color: 'from-orange-500 to-red-500' },
    { name: 'Tracking', href: '/admin/tracking', icon: AcademicCapIcon, color: 'from-amber-500 to-orange-500' },
    { name: 'Statistics', href: '/admin/statistics', icon: ChartBarIcon, color: 'from-rose-500 to-pink-500' },
  ];

  const navItems = user?.isAdmin ? adminNavItems : studentNavItems;

  // Mock active students count - in real app, this would come from an API
  useEffect(() => {
    const fetchActiveStudents = async () => {
      try {
        // Mock data for active students
        const mockActiveStudents = Math.floor(Math.random() * 50) + 100; // 100-150 active students
        setActiveStudents(mockActiveStudents);
      } catch (error) {
        console.error('Failed to fetch active students:', error);
      }
    };

    fetchActiveStudents();
    // Update every 30 seconds
    const interval = setInterval(fetchActiveStudents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Hide sidebar on exam pages */}
      {!isExamPage && (
        <>
          {/* Mobile sidebar */}
          <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                 onClick={() => setSidebarOpen(false)} />
            <div className={`relative flex w-72 flex-1 flex-col bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                      PlacePro
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">Campus Placement</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-indigo-200 scale-[1.02]`
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.01]'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-slate-100 px-4 py-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{user?.rollNumber}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-100 hover:text-red-600 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
            <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl shadow-slate-200/50">
              <div className="flex items-center px-6 py-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                      PlacePro
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">Campus Placement System</p>
                  </div>
                </div>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-indigo-200 scale-[1.02]`
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-slate-100 px-4 py-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.rollNumber}</p>
                    {user?.isAdmin && (
                      <>
                        <p className="text-xs text-primary-600 font-medium">Administrator</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-gray-600">{activeStudents} active</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className={isExamPage ? "" : "lg:pl-72 flex flex-col flex-1"}>
        {/* Top header - show exam header on exam pages, normal header otherwise */}
        {isExamPage ? (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 sticky top-0 z-40 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{user?.name || 'Student'}</div>
                    <div className="text-sm text-white/80">Roll No: {user?.rollNumber || 'N/A'}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/30"></div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="text-white/80">Department</div>
                    <div className="font-medium">{user?.department || 'N/A'}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-white/80">Year</div>
                    <div className="font-medium">{user?.year || 'N/A'}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  Online Test in Progress
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-4 lg:px-8 lg:py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {navItems.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
              <div className="w-8" />
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
