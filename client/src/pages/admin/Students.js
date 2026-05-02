import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import {
  UserIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  FolderIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [placementFilter, setPlacementFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    branch: '',
    year: '',
    'profile.placementStatus': 'Not Placed',
    'profile.placedCompany': '',
    'profile.package': ''
  });

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, branchFilter, yearFilter, placementFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Mock students data
      const mockStudents = [
        {
          _id: '1',
          name: 'John Doe',
          rollNumber: '23761A05M9',
          email: 'john@college.edu',
          branch: 'CSE',
          year: '3',
          profile: { placementStatus: 'Not Placed', placedCompany: '', package: '' }
        },
        {
          _id: '2',
          name: 'Jane Smith',
          rollNumber: '23761A05H2',
          email: 'jane@college.edu',
          branch: 'ECE',
          year: '3',
          profile: { placementStatus: 'Placed', placedCompany: 'TCS', package: '7.5' }
        },
        {
          _id: '3',
          name: 'Bob Johnson',
          rollNumber: '23761A05B7',
          email: 'bob@college.edu',
          branch: 'CSE',
          year: '4',
          profile: { placementStatus: 'Placed', placedCompany: 'Infosys', package: '6.8' }
        }
      ];
      setStudents(mockStudents);
      setPagination({ totalPages: 1, currentPage: 1, total: 3 });
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        branch: formData.branch,
        year: formData.year,
        profile: {
          placementStatus: formData['profile.placementStatus'],
          placedCompany: formData['profile.placedCompany'] || null,
          package: formData['profile.package'] ? parseFloat(formData['profile.package']) : null
        }
      };

      // Mock API call - just update local state
      
      setStudents(prev => 
        prev.map(student => 
          student._id === editingStudent._id ? { ...student, ...updateData } : student
        )
      );
      
      setShowEditModal(false);
      setEditingStudent(null);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      // Mock API call - just update local state
      setStudents(prev => prev.filter(student => student._id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phoneNumber: student.phoneNumber,
      branch: student.branch,
      year: student.year,
      'profile.placementStatus': student.profile?.placementStatus || 'Not Placed',
      'profile.placedCompany': student.profile?.placedCompany || '',
      'profile.package': student.profile?.package || ''
    });
    setShowEditModal(true);
  };

  const handleViewStudent = async (student) => {
    setViewingStudent(student);
    setShowViewModal(true);
    setActiveTab('personal');
    
    try {
      // Fetch detailed profile data
      const profiles = await profileService.getAllProfiles();
      setStudentProfile(profiles);
    } catch (error) {
      toast.error('Failed to load student profile');
    }
  };

  const handleVerifyDocument = (docType) => {
    toast.success(`${docType} verified successfully`);
  };

  const handleRejectDocument = (docType) => {
    toast.error(`${docType} rejected`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed':
        return 'text-green-600 bg-green-100';
      case 'Higher Studies':
        return 'text-blue-600 bg-blue-100';
      case 'Entrepreneur':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st', '2nd', '3rd', '4th'];
  const placementStatuses = ['Not Placed', 'Placed', 'Higher Studies', 'Entrepreneur'];

  if (loading && students.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
        <p className="mt-2 text-gray-600">View and manage student information and placement status</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search students..."
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
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="input"
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year} Year</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="input"
              value={placementFilter}
              onChange={(e) => {
                setPlacementFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              {placementStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {students.length} students
            {pagination.total && ` of ${pagination.total} total`}
          </p>
          {(searchTerm || branchFilter || yearFilter || placementFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setBranchFilter('');
                setYearFilter('');
                setPlacementFilter('');
                setCurrentPage(1);
              }}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placement Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.rollNumber}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.branch}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.year}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.profile?.placementStatus)}`}>
                      {student.profile?.placementStatus || 'Not Placed'}
                    </span>
                    {student.profile?.placedCompany && (
                      <div className="text-xs text-gray-500 mt-1">
                        {student.profile.placedCompany}
                        {student.profile.package && (
                          <span className="ml-1">({student.profile.package} LPA)</span>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewStudent(student)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && !loading && (
          <div className="text-center py-8">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No students found</p>
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

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Student</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingStudent(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label">Branch</label>
                  <select
                    className="input"
                    value={formData.branch}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                    required
                  >
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Year</label>
                  <select
                    className="input"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Placement Status</label>
                  <select
                    className="input"
                    value={formData['profile.placementStatus']}
                    onChange={(e) => setFormData(prev => ({ ...prev, 'profile.placementStatus': e.target.value }))}
                  >
                    {placementStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Placed Company</label>
                  <input
                    type="text"
                    className="input"
                    value={formData['profile.placedCompany']}
                    onChange={(e) => setFormData(prev => ({ ...prev, 'profile.placedCompany': e.target.value }))}
                    placeholder="Company name (if placed)"
                  />
                </div>

                <div>
                  <label className="label">Package (LPA)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData['profile.package']}
                    onChange={(e) => setFormData(prev => ({ ...prev, 'profile.package': e.target.value }))}
                    placeholder="Annual package in LPA"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingStudent(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      {showViewModal && viewingStudent && studentProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-4 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{viewingStudent.name}</h3>
                <p className="text-sm text-gray-600">{viewingStudent.rollNumber} - {viewingStudent.branch} ({viewingStudent.year} Year)</p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingStudent(null);
                  setStudentProfile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'personal', name: 'Personal', icon: UserIcon },
                  { id: 'coding', name: 'Coding Profiles', icon: CodeBracketIcon },
                  { id: 'projects', name: 'Projects', icon: FolderIcon },
                  { id: 'education', name: 'Education', icon: AcademicCapIcon },
                  { id: 'skills', name: 'Skills', icon: CheckCircleIcon },
                  { id: 'documents', name: 'Documents', icon: DocumentTextIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{studentProfile.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{studentProfile.phoneNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">GitHub</p>
                    <a href={studentProfile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {studentProfile.github || 'Not provided'}
                    </a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <a href={studentProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {studentProfile.linkedin || 'Not provided'}
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'coding' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(studentProfile.profile?.codingProfiles || {}).map(([platform, url]) => (
                    <div key={platform} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 capitalize">{platform}</p>
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {url}
                        </a>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentProfile.profile?.projects?.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-gray-600">{project.language}</p>
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          View on GitHub
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'education' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">CGPA</p>
                    <p className="text-2xl font-bold text-gray-900">{studentProfile.profile?.education?.cgpa || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Backlogs</p>
                    <p className="text-2xl font-bold text-gray-900">{studentProfile.profile?.education?.backlogs || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Backlog Semesters</p>
                    <p className="font-medium">{studentProfile.profile?.education?.backlogSemesters || 'None'}</p>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Programming Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.profile?.skills?.languages?.map((lang, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {lang} ({studentProfile.profile.skills.languageLevels?.[idx] || 'N/A'})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.profile?.skills?.tools?.map((tool, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Roles Interested</h4>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.profile?.skills?.roles?.map((role, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Apps/Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.profile?.skills?.apps?.map((app, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Certifications</h4>
                    <div className="space-y-2">
                      {studentProfile.profile?.certifications?.map((cert, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-3">
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-600">{cert.issuer} - {new Date(cert.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'resume', label: 'Resume' },
                    { key: 'idCard', label: 'ID Card' },
                    { key: 'intermediateMarks', label: 'Intermediate Marks' },
                    { key: 'tenthMarks', label: '10th Marks' }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{doc.label}</h4>
                        {studentProfile.profile?.documents?.[doc.key] ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      {studentProfile.profile?.documents?.[doc.key] ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyDocument(doc.label)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleRejectDocument(doc.label)}
                            className="btn-outline text-sm px-3 py-1 text-red-600 border-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Not uploaded</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
