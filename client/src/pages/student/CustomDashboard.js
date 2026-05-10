import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { companyService } from '../../services/companyService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CustomDashboard = () => {
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
      const mockInterviews = mockApplications
        .filter(app => app.interviewDate && new Date(app.interviewDate) > new Date())
        .map(app => ({
          company: app.company.name,
          date: app.interviewDate,
          type: 'Technical Interview'
        }));

      setUpcomingInterviews(mockInterviews);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: '📋',
      color: 'from-blue-500 to-cyan-600',
      change: '+2 this week'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewScheduled,
      icon: '📅',
      color: 'from-amber-500 to-orange-600',
      change: '+1 this week'
    },
    {
      title: 'Selected Companies',
      value: stats.selected,
      icon: '✅',
      color: 'from-emerald-500 to-teal-600',
      change: '+1 this month'
    },
    {
      title: 'Placement Status',
      value: stats.placementStatus,
      icon: '🎯',
      color: 'from-purple-500 to-pink-600',
      change: 'In Progress'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-neutral-600">
            Here's your placement journey overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} variant="elevated" className="hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                  <div className="text-sm text-neutral-600">{stat.title}</div>
                </div>
              </div>
              <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-full`}></div>
              <div className="text-xs font-medium text-neutral-500">{stat.change}</div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card variant="floating" className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Applications</h2>
              <Link
                to="/applications"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentApplications.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                      {app.company.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{app.company.name}</div>
                      <div className="text-sm text-neutral-600">
                        Applied on {new Date(app.applicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Selected' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Applied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {recentApplications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-neutral-600">No applications yet. Start applying to companies!</p>
                <Link to="/companies">
                  <Button variant="primary" className="mt-4">
                    Browse Companies
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Upcoming Interviews */}
          <Card variant="floating" className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Upcoming Interviews</h2>
              <Link
                to="/applications"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Manage →
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview, index) => (
                  <div key={index} className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📅</div>
                        <div>
                          <div className="font-semibold text-neutral-900">{interview.company}</div>
                          <div className="text-sm text-neutral-600">
                            {new Date(interview.date).toLocaleDateString()} at {new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="text-xs text-amber-600 font-medium">{interview.type}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Join Interview
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-neutral-600">No interviews scheduled yet.</p>
                  <p className="text-sm text-neutral-500 mt-2">
                    Keep applying and preparing for interviews!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card variant="elevated">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/companies">
                <Button variant="outline" className="w-full">
                  🏢 Browse Companies
                </Button>
              </Link>
              <Link to="/tests">
                <Button variant="outline" className="w-full">
                  📝 Take Tests
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full">
                  👤 Update Profile
                </Button>
              </Link>
              <Link to="/payment">
                <Button variant="outline" className="w-full">
                  💳 Pay Fees
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomDashboard;
