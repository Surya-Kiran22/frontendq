import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock applications data generator
const generateMockApplications = (companies) => {
  const statuses = ['Applied', 'Resume Shortlisted', 'Technical Round', 'HR Round', 'Selected', 'Rejected'];
  const applications = [];
  
  // Generate 8-12 random applications
  const numApplications = Math.floor(Math.random() * 5) + 8;
  
  for (let i = 0; i < numApplications; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const applicationDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000);
    
    let interviewDate = null;
    if (['Technical Round', 'HR Round', 'Selected'].includes(status)) {
      interviewDate = new Date(Date.now() + Math.floor(Math.random() * 14) * 86400000);
    }
    
    applications.push({
      _id: `app_${i}`,
      company: {
        _id: company._id,
        name: company.name,
        industry: company.industry,
        logo: company.logo || null
      },
      status: status,
      applicationDate: applicationDate.toISOString(),
      interviewDate: interviewDate ? interviewDate.toISOString() : null,
      notes: status === 'Selected' ? 'Congratulations! Offer letter received.' : 
             status === 'Rejected' ? 'Will try again next time.' : 
             'Preparing for next round.',
      position: company.positions?.[0]?.title || 'Software Engineer'
    });
  }
  
  return applications.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      const companies = await companyService.getAllCompanies();
      const mockApplications = generateMockApplications(companies);
      setApplications(mockApplications);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filterApplications = useCallback(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selected':
        return CheckCircleIcon;
      case 'Rejected':
        return XMarkIcon;
      default:
        return ClockIcon;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'Applied').length,
      shortlisted: applications.filter(app => app.status === 'Resume Shortlisted').length,
      interview: applications.filter(app => 
        ['Technical Round', 'HR Round'].includes(app.status)
      ).length,
      selected: applications.filter(app => app.status === 'Selected').length,
      rejected: applications.filter(app => app.status === 'Rejected').length,
    };
    return counts;
  };

  const stats = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="section-title">My Applications</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your job applications and interview schedules
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2">
            <ChartBarIcon className="h-6 w-6 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          <p className="text-sm text-gray-600">Applied</p>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
            <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.shortlisted}</p>
          <p className="text-sm text-gray-600">Shortlisted</p>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mx-auto mb-2">
            <ClockIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.interview}</p>
          <p className="text-sm text-gray-600">Interview</p>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.selected}</p>
          <p className="text-sm text-gray-600">Selected</p>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
            <XMarkIcon className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-12"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Resume Shortlisted">Resume Shortlisted</option>
              <option value="Technical Round">Technical Round</option>
              <option value="HR Round">HR Round</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredApplications.length}</span> of <span className="font-semibold">{applications.length}</span> applications
          </p>
          {(searchTerm || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company & Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Interview Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application, index) => {
                  const StatusIcon = getStatusIcon(application.status);
                  
                  return (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3">
                            <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {application.company.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <BriefcaseIcon className="h-3 w-3 mr-1" />
                              {application.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(application.applicationDate)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {application.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {application.interviewDate ? (
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                              {formatDateTime(application.interviewDate)}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not scheduled</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/companies/${application.company._id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                        >
                          View Details
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4">
            <DocumentTextIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter ? 'No applications found' : 'No applications yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filters'
              : 'Start applying to companies to track your applications here'}
          </p>
          {!searchTerm && !statusFilter && (
            <Link to="/companies" className="btn-primary">
              Browse Companies
            </Link>
          )}
          {(searchTerm || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Upcoming Interviews Section */}
      {applications.some(app => app.interviewDate && new Date(app.interviewDate) > new Date()) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {applications
                .filter(app => app.interviewDate && new Date(app.interviewDate) > new Date())
                .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
                .map((application, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {application.company.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(application.interviewDate)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/companies/${application.company._id}`}
                          className="btn-outline text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
