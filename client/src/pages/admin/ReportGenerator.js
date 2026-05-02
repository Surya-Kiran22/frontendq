import React, { useState, useEffect } from 'react';
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ReportGenerator = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      name: 'Rahul Kumar',
      rollNumber: '2025CS001',
      email: 'rahul.kumar@college.edu',
      phone: '+91 9876543210',
      branch: 'Computer Science',
      cgpa: 8.5,
      backlogCount: 0,
      placedCompany: 'TCS',
      package: '8 LPA',
      status: 'qualified',
      interviewDate: '2025-01-15',
      skills: ['Python', 'Java', 'React', 'Node.js'],
      certifications: ['AWS Certified', 'Google Cloud']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rollNumber: '2025CS002',
      email: 'priya.sharma@college.edu',
      phone: '+91 9876543211',
      branch: 'Computer Science',
      cgpa: 7.2,
      backlogCount: 1,
      placedCompany: 'Infosys',
      package: '6 LPA',
      status: 'qualified',
      interviewDate: '2025-01-16',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      certifications: ['Oracle Certified']
    },
    {
      id: 3,
      name: 'Amit Singh',
      rollNumber: '2025EC001',
      email: 'amit.singh@college.edu',
      phone: '+91 9876543212',
      branch: 'Electronics',
      cgpa: 6.8,
      backlogCount: 2,
      placedCompany: null,
      package: null,
      status: 'not_qualified',
      interviewDate: null,
      skills: ['C++', 'Embedded Systems'],
      certifications: []
    },
    {
      id: 4,
      name: 'Neha Patel',
      rollNumber: '2025ME001',
      email: 'neha.patel@college.edu',
      phone: '+91 9876543213',
      branch: 'Mechanical',
      cgpa: 9.1,
      backlogCount: 0,
      placedCompany: 'Wipro',
      package: '7 LPA',
      status: 'qualified',
      interviewDate: '2025-01-17',
      skills: ['AutoCAD', 'SolidWorks', 'Python'],
      certifications: ['AutoCAD Certified']
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      rollNumber: '2025EE001',
      email: 'vikram.reddy@college.edu',
      phone: '+91 9876543214',
      branch: 'Electrical',
      cgpa: 5.9,
      backlogCount: 3,
      placedCompany: null,
      package: null,
      status: 'not_qualified',
      interviewDate: null,
      skills: ['MATLAB', 'PLC'],
      certifications: []
    }
  ];

  const companies = ['all', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = students;

    // Filter by company
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(student => student.placedCompany === selectedCompany);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedCompany, selectedStatus, searchTerm]);

  const generateExcel = () => {
    // Create CSV content
    const headers = [
      'Name', 'Roll Number', 'Email', 'Phone', 'Branch', 'CGPA', 
      'Backlogs', 'Status', 'Placed Company', 'Package', 'Interview Date',
      'Skills', 'Certifications'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.rollNumber,
        student.email,
        student.phone,
        student.branch,
        student.cgpa,
        student.backlogCount,
        student.status === 'qualified' ? 'Qualified' : 'Not Qualified',
        student.placedCompany || 'Not Placed',
        student.package || 'N/A',
        student.interviewDate || 'N/A',
        `"${student.skills.join(', ')}"`,
        `"${student.certifications.join(', ')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `placement_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report downloaded successfully!');
  };

  const qualifiedCount = filteredStudents.filter(s => s.status === 'qualified').length;
  const notQualifiedCount = filteredStudents.filter(s => s.status === 'not_qualified').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Report Generator</h1>
              <p className="text-lg text-white/90 mt-1">Advanced Placement Analytics & Reporting</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+12%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-blue-600 mb-1">Total Students</h3>
            <p className="text-3xl font-bold text-gray-900">{filteredStudents.length}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+8%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-emerald-600 mb-1">Qualified</h3>
            <p className="text-3xl font-bold text-gray-900">{qualifiedCount}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 border border-rose-200 hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
                <XCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-rose-600">
                <ArrowTrendingDownIcon className="h-4 w-4" />
                <span className="text-xs font-medium">-5%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-rose-600 mb-1">Not Qualified</h3>
            <p className="text-3xl font-bold text-gray-900">{notQualifiedCount}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+15%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-purple-600 mb-1">Success Rate</h3>
            <p className="text-3xl font-bold text-gray-900">
              {filteredStudents.length > 0 ? Math.round((qualifiedCount / filteredStudents.length) * 100) : 0}%
            </p>
            <div className="mt-3 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Filters & Actions</h2>
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">🏢 All Companies</option>
              {companies.slice(1).map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">📊 All Status</option>
              <option value="qualified">✅ Qualified</option>
              <option value="not_qualified">❌ Not Qualified</option>
            </select>
          </div>
          <button
            onClick={generateExcel}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5"
          >
            <DocumentArrowDownIcon className="h-5 w-5 group-hover:animate-bounce" />
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Student Records</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{filteredStudents.length} records found</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Placement
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Skills & Certifications
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-200 transition-all">
                          <span className="text-white font-bold text-lg">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          student.status === 'qualified' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.rollNumber}</div>
                        <div className="text-xs text-gray-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-900">{student.branch}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">CGPA:</span>
                          <span className={`text-sm font-bold ${
                            student.cgpa >= 8 ? 'text-green-600' : 
                            student.cgpa >= 7 ? 'text-yellow-600' : 'text-red-600'
                          }`}>{student.cgpa}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Backlogs:</span>
                          <span className={`text-sm font-bold ${
                            student.backlogCount === 0 ? 'text-green-600' : 
                            student.backlogCount <= 2 ? 'text-yellow-600' : 'text-red-600'
                          }`}>{student.backlogCount}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
                        student.status === 'qualified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {student.status === 'qualified' ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Qualified
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Not Qualified
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.placedCompany ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold text-gray-900">{student.placedCompany}</span>
                        </div>
                        <div className="text-sm font-bold text-green-600">{student.package}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {student.interviewDate}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <XCircleIcon className="h-4 w-4" />
                        <span className="text-sm">Not Placed</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-200">
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                            +{student.skills.length - 3}
                          </span>
                        )}
                      </div>
                      {student.certifications.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-xs text-purple-600 font-medium">
                            {student.certifications.length} certification{student.certifications.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
