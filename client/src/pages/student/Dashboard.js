import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { companyService } from '../../services/companyService';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalApplications: 12,
    pendingApplications: 5,
    interviewScheduled: 3,
    selected: 2,
    rejected: 2,
    placementStatus: 'In Progress',
    placedCompany: null,
    package: null
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use mock data instead of API calls
      const companiesData = await companyService.getAllCompanies();

      // Mock recent applications
      const mockApplications = companiesData.slice(0, 5).map((company, index) => ({
        company: { name: company.name },
        applicationDate: new Date(Date.now() - index * 86400000).toISOString(),
        status: ['Applied', 'Resume Shortlisted', 'Technical Round', 'HR Round', 'Selected'][index % 5],
        interviewDate: index < 3 ? new Date(Date.now() + (index + 1) * 86400000 * 2).toISOString() : null
      }));

      setRecentApplications(mockApplications);

      // Filter upcoming interviews
      const upcoming = mockApplications
        .filter(app => app.interviewDate && new Date(app.interviewDate) > new Date())
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
        .slice(0, 3);

      setUpcomingInterviews(upcoming);
    } catch (error) {
      // Error fetching dashboard data
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
      case 'Rejected':
        return 'text-rose-700 bg-rose-100 border border-rose-200';
      case 'Technical Round':
      case 'HR Round':
        return 'text-blue-700 bg-blue-100 border border-blue-200';
      case 'Resume Shortlisted':
        return 'text-amber-700 bg-amber-100 border border-amber-200';
      default:
        return 'text-slate-700 bg-slate-100 border border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-indigo-200">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-indigo-100 text-lg font-medium">
            Track your placement journey and prepare for your dream career
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
              {user?.department}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
              Year {user?.year}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
              CGPA: {user?.cgpa}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalApplications}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Total Applications</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-amber-100 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-amber-200">
            <ClockIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.pendingApplications}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Pending</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-violet-200">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.interviewScheduled}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Interviews</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg shadow-emerald-200">
            <CheckCircleIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.selected}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">Selected</p>
        </div>
      </div>

      {/* Placement Status Card */}
      {(stats.placementStatus === 'Placed' || stats.placedCompany) && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl shadow-emerald-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mr-6">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Congratulations! 🎉</h3>
              <p className="text-emerald-50 text-lg">
                You are placed at <span className="font-bold">{stats.placedCompany}</span>
                {stats.package && (
                  <>
                    {' '}with a package of <span className="font-bold">₹{stats.package.toLocaleString()} LPA</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mr-3">
                <BriefcaseIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Recent Applications</h2>
            </div>
          </div>
          <div className="p-6">
            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.map((application, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-all duration-200 border border-slate-100 hover:border-blue-200">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{application.company.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Applied on {formatDate(application.applicationDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No applications yet</p>
                <Link
                  to="/companies"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
                >
                  Browse Companies
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl mr-3">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Upcoming Interviews</h2>
            </div>
          </div>
          <div className="p-6">
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map((interview, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{interview.company.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(interview.interviewDate)}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold border border-violet-200">Scheduled</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No upcoming interviews</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/companies"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 border border-blue-100 hover:border-blue-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Browse Companies</span>
            </Link>
            <Link
              to="/tests"
              className="flex items-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:from-violet-100 hover:to-purple-100 transition-all duration-200 border border-violet-100 hover:border-violet-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Take Practice Tests</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 border border-emerald-100 hover:border-emerald-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
