import React, { useState, useEffect, useCallback } from 'react';
import { companyService } from '../../services/companyService';
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminTracking = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchCompanies = useCallback(async () => {
    try {
      const companiesData = await mockCompanyService.getAllCompanies();
      setCompanies(companiesData);
    } catch (error) {
      // Error fetching companies
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const fetchTrackingData = useCallback(async () => {
    setLoading(true);
    try {
      const companiesData = await mockCompanyService.getAllCompanies();
      
      // Mock tracking data with round completion status and scores
      const allTracking = [];
      const studentNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
      
      companiesData.forEach((company) => {
        studentNames.forEach((studentName, idx) => {
          const rounds = ['Aptitude', 'Coding', 'Communication', 'Interview', 'HR'];
          const completedRounds = rounds.slice(0, Math.floor(Math.random() * 6));
          const currentRound = completedRounds.length < rounds.length ? rounds[completedRounds.length] : 'Completed';
          const score = Math.floor(Math.random() * 40) + 60;
          
          allTracking.push({
            _id: `${company._id}-${idx}`,
            studentName,
            rollNumber: `23761A05${idx}`,
            branch: ['CSE', 'ECE', 'EEE', 'MECH'][idx % 4],
            year: ['3rd', '4th'][idx % 2],
            companyId: company._id,
            companyName: company.name,
            completedRounds,
            currentRound,
            score,
            interviewDate: completedRounds.length >= 3 ? new Date(Date.now() + Math.random() * 7 * 86400000).toISOString() : null,
            notes: 'Application submitted successfully'
          });
        });
      });
      
      // Filter by selected company
      const filteredData = selectedCompany 
        ? allTracking.filter(app => app.companyId === selectedCompany)
        : allTracking;
      
      setTrackingData(filteredData);
      setPagination({ totalPages: 1, currentPage: 1, total: filteredData.length });
    } catch (error) {
      // Error fetching tracking data
    } finally {
      setLoading(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchTrackingData();
  }, [fetchTrackingData, currentPage, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'HR':
        return 'text-purple-600 bg-purple-100';
      case 'Interview':
        return 'text-blue-600 bg-blue-100';
      case 'Communication':
        return 'text-orange-600 bg-orange-100';
      case 'Coding':
        return 'text-cyan-600 bg-cyan-100';
      case 'Aptitude':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusCounts = () => {
    const counts = {
      total: trackingData.length,
      aptitude: trackingData.filter(app => app.currentRound === 'Aptitude' || app.completedRounds.includes('Aptitude')).length,
      coding: trackingData.filter(app => app.currentRound === 'Coding' || app.completedRounds.includes('Coding')).length,
      communication: trackingData.filter(app => app.currentRound === 'Communication' || app.completedRounds.includes('Communication')).length,
      interview: trackingData.filter(app => app.currentRound === 'Interview' || app.completedRounds.includes('Interview')).length,
      hr: trackingData.filter(app => app.currentRound === 'HR' || app.completedRounds.includes('HR')).length,
      completed: trackingData.filter(app => app.currentRound === 'Completed').length,
    };
    return counts;
  };

  const stats = getStatusCounts();

  if (loading && trackingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Application Tracking</h1>
        <p className="mt-2 text-gray-600">
          Monitor all student applications and their current status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.aptitude}</p>
            <p className="text-sm text-gray-600">Aptitude</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600">{stats.coding}</p>
            <p className="text-sm text-gray-600">Coding</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.communication}</p>
            <p className="text-sm text-gray-600">Communication</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.interview}</p>
            <p className="text-sm text-gray-600">Interview</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              className="input"
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search by student name or roll number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          
          <div>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Rounds</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Coding">Coding</option>
              <option value="Communication">Communication</option>
              <option value="Interview">Interview</option>
              <option value="HR">HR</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {trackingData.length} applications
            {selectedCompany && ` for ${companies.find(c => c._id === selectedCompany)?.name}`}
          </p>
          {(searchTerm || statusFilter || selectedCompany) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setSelectedCompany('');
                setCurrentPage(1);
              }}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Completed Rounds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trackingData.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.rollNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          {application.branch} • {application.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {application.companyName}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {application.completedRounds.map((round, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(round)}`}
                        >
                          {round}
                        </span>
                      ))}
                      {application.completedRounds.length === 0 && (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.currentRound)}`}>
                      {application.currentRound}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {application.score}%
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {application.interviewDate ? formatDate(application.interviewDate) : 'Not scheduled'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trackingData.length === 0 && !loading && (
          <div className="text-center py-8">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No applications found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-3 py-2 rounded-md border text-sm font-medium ${
                        page === pagination.page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTracking;
