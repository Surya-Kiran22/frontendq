import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    placedStudents: 0,
    placementRate: 0,
    recentApplications: [],
    companyApplications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const companies = await companyService.getAllCompanies();
      
      // Mock company applications data
      const companyApps = companies.map(company => ({
        _id: company._id,
        name: company.name,
        totalApplications: Math.floor(Math.random() * 200) + 50,
        shortlisted: Math.floor(Math.random() * 50) + 10,
        selected: Math.floor(Math.random() * 30) + 5,
        rejected: Math.floor(Math.random() * 20) + 5,
        inProgress: Math.floor(Math.random() * 40) + 10
      }));
      
      // Mock dashboard data
      setDashboardData({
        totalStudents: 450,
        totalCompanies: companies.length,
        placedStudents: 320,
        placementRate: 71,
        recentApplications: companies.slice(0, 5).map((company, idx) => ({
          _id: idx,
          studentName: ['Alice', 'Bob', 'Charlie', 'David', 'Emma'][idx],
          companyName: company.name,
          status: ['Applied', 'Shortlisted', 'Selected', 'Interview', 'Applied'][idx],
          appliedDate: new Date(Date.now() - idx * 86400000).toISOString()
        })),
        companyApplications: companyApps
      });
    } catch (error) {
      // Error fetching dashboard data
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (data, filename) => {
    // Create CSV content
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportApplications = () => {
    const exportData = dashboardData.companyApplications.map(company => ({
      Company: company.name,
      Total_Applications: company.totalApplications,
      Shortlisted: company.shortlisted,
      Selected: company.selected,
      Rejected: company.rejected,
      In_Progress: company.inProgress
    }));
    exportToExcel(exportData, 'company_applications_report');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Technical Round':
      case 'HR Round':
        return 'text-blue-600 bg-blue-100';
      case 'Resume Shortlisted':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-primary-100">
          Manage placement activities and track student progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Placed Students</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.placedStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Placement Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.placementRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/companies"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Manage Companies</p>
                <p className="text-xs text-gray-500">Add/edit companies</p>
              </div>
            </Link>

            <Link
              to="/admin/students"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Manage Students</p>
                <p className="text-xs text-gray-500">View student data</p>
              </div>
            </Link>

            <Link
              to="/admin/tracking"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Application Tracking</p>
                <p className="text-xs text-gray-500">Track applications</p>
              </div>
            </Link>

            <Link
              to="/admin/statistics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Statistics</p>
                <p className="text-xs text-gray-500">View analytics</p>
              </div>
            </Link>

            <Link
              to="/admin/test-creator"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AcademicCapIcon className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Test Creator</p>
                <p className="text-xs text-gray-500">Create company tests</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Company Applications Report */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Company Applications Report</h2>
          <button
            onClick={handleExportApplications}
            className="flex items-center gap-2 btn-primary text-sm"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Export to Excel
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shortlisted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.companyApplications.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">{company.totalApplications}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {company.shortlisted}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {company.selected}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {company.rejected}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {company.inProgress}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
        </div>
        <div className="p-6">
          {dashboardData.recentApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentApplications.map((application, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.rollNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.company?.[0]?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(application.applicationDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No recent applications</p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link
              to="/admin/tracking"
              className="btn-primary"
            >
              View All Applications
            </Link>
          </div>
        </div>
      </div>

      {/* Placement Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Placement Overview</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total Students</span>
                <span className="text-sm font-bold text-gray-900">{dashboardData.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Placed Students</span>
                <span className="text-sm font-bold text-green-600">{dashboardData.placedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Not Placed</span>
                <span className="text-sm font-bold text-gray-600">
                  {dashboardData.totalStudents - dashboardData.placedStudents}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Placement Rate</span>
                  <span className="text-lg font-bold text-primary-600">{dashboardData.placementRate}%</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${dashboardData.placementRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Database Connection</p>
                  <p className="text-xs text-gray-500">Connected to MongoDB Atlas</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">API Server</p>
                  <p className="text-xs text-gray-500">Running normally</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Authentication</p>
                  <p className="text-xs text-gray-500">JWT tokens active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
