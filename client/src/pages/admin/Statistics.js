import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState({
    branchStats: [],
    yearStats: [],
    companyWiseStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Mock statistics data
      setStatistics({
        branchStats: [
          { name: 'CSE', placed: 120, total: 200 },
          { name: 'ECE', placed: 80, total: 150 },
          { name: 'MECH', placed: 60, total: 120 },
          { name: 'CIVIL', placed: 40, total: 100 },
          { name: 'IT', placed: 90, total: 140 }
        ],
        yearStats: [
          { name: '2021', placed: 150, total: 250 },
          { name: '2022', placed: 180, total: 280 },
          { name: '2023', placed: 220, total: 300 },
          { name: '2024', placed: 320, total: 450 }
        ],
        companyWiseStats: [
          { name: 'TCS', placed: 80, total: 100 },
          { name: 'Infosys', placed: 70, total: 90 },
          { name: 'Wipro', placed: 60, total: 80 },
          { name: 'Capgemini', placed: 50, total: 70 },
          { name: 'HCL', placed: 40, total: 60 }
        ]
      });
    } catch (error) {
      // Error fetching statistics
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Placement Statistics</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive analytics and insights about placement activities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.branchStats.reduce((acc, branch) => acc + branch.total, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Placed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.branchStats.reduce((acc, branch) => acc + branch.placed, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Companies</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.companyWiseStats.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Placement Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.branchStats.length > 0 
                  ? Math.round(
                      statistics.branchStats.reduce((acc, branch) => 
                        acc + (branch.total > 0 ? (branch.placed / branch.total) * 100 : 0), 0
                      ) / statistics.branchStats.length
                    )
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Branch-wise Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch-wise Placement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.branchStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#93c5fd" name="Total Students" />
              <Bar dataKey="placed" fill="#10b981" name="Placed Students" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {statistics.branchStats.map((branch, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium">{branch._id}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {branch.placed}/{branch.total}
                  </span>
                  <span className="font-medium text-green-600">
                    {branch.total > 0 ? Math.round((branch.placed / branch.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year-wise Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Year-wise Placement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.yearStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#fbbf24" name="Total Students" />
              <Bar dataKey="placed" fill="#10b981" name="Placed Students" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {statistics.yearStats.map((year, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium">{year._id} Year</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {year.placed}/{year.total}
                  </span>
                  <span className="font-medium text-green-600">
                    {year.total > 0 ? Math.round((year.placed / year.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company-wise Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Companies by Hires</h2>
        
        {statistics.companyWiseStats.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.companyWiseStats.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Students Placed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics.companyWiseStats.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statistics.companyWiseStats.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No placement data available</p>
          </div>
        )}
        
        {statistics.companyWiseStats.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Detailed Company Stats</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students Placed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.companyWiseStats.map((company, index) => {
                    const totalPlaced = statistics.companyWiseStats.reduce((acc, c) => acc + c.count, 0);
                    const percentage = totalPlaced > 0 ? (company.count / totalPlaced) * 100 : 0;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {company._id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">
                              {percentage.toFixed(1)}%
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Best Performing Branch</h3>
            <p className="text-2xl font-bold text-green-600">
              {statistics.branchStats.length > 0 
                ? statistics.branchStats.reduce((best, branch) => {
                    const bestRate = best.total > 0 ? (best.placed / best.total) * 100 : 0;
                    const branchRate = branch.total > 0 ? (branch.placed / branch.total) * 100 : 0;
                    return branchRate > bestRate ? branch : best;
                  })._id
                : 'N/A'
              }
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Top Recruiter</h3>
            <p className="text-lg font-bold text-blue-600">
              {statistics.companyWiseStats.length > 0 
                ? statistics.companyWiseStats[0]._id
                : 'N/A'
              }
            </p>
            <p className="text-sm text-gray-600">
              {statistics.companyWiseStats.length > 0 
                ? `${statistics.companyWiseStats[0].count} students`
                : ''
              }
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Most Active Year</h3>
            <p className="text-2xl font-bold text-purple-600">
              {statistics.yearStats.length > 0 
                ? statistics.yearStats.reduce((most, year) => 
                    year.total > most.total ? year : most
                  )._id
                : 'N/A'
              }
            </p>
            <p className="text-sm text-gray-600">
              {statistics.yearStats.length > 0 
                ? `${statistics.yearStats.reduce((most, year) => 
                    year.total > most.total ? year : most
                  ).total} applications`
                : ''
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
