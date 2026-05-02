import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CompanyBranchManager = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hasChanges, setHasChanges] = useState(false);

  // Available branches
  const availableBranches = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Automobile', 'Instrumentation'];

  // Mock company data with branch assignments
  const mockCompanies = [
    {
      id: 1,
      name: 'TCS',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png',
      industry: 'IT Services',
      package: '7-12 LPA',
      assignedBranches: ['CSE', 'IT', 'ECE'],
      isCommonToAll: false,
      lastUpdated: '2025-01-15',
      updatedBy: 'Admin'
    },
    {
      id: 2,
      name: 'Infosys',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png',
      industry: 'IT Services',
      package: '6-10 LPA',
      assignedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
      isCommonToAll: false,
      lastUpdated: '2025-01-14',
      updatedBy: 'Admin'
    },
    {
      id: 3,
      name: 'Wipro',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color.png/1200px-Wipro_Primary_Logo_Color.png',
      industry: 'IT Services',
      package: '5-9 LPA',
      assignedBranches: ['CSE', 'IT', 'Mechanical'],
      isCommonToAll: false,
      lastUpdated: '2025-01-13',
      updatedBy: 'Admin'
    },
    {
      id: 4,
      name: 'Accenture',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Accenture_logo.svg/1200px-Accenture_logo.svg.png',
      industry: 'Consulting',
      package: '8-15 LPA',
      assignedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
      isCommonToAll: false,
      lastUpdated: '2025-01-12',
      updatedBy: 'Admin'
    },
    {
      id: 5,
      name: 'Cognizant',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cognizant_Logo.png/1200px-Cognizant_Logo.png',
      industry: 'IT Services',
      package: '6-12 LPA',
      assignedBranches: ['CSE', 'IT', 'ECE'],
      isCommonToAll: false,
      lastUpdated: '2025-01-11',
      updatedBy: 'Admin'
    },
    {
      id: 6,
      name: 'Texas Instruments',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Texas_Instruments_logo.svg/1200px-Texas_Instruments_logo.svg.png',
      industry: 'Semiconductor',
      package: '8-14 LPA',
      assignedBranches: ['ECE', 'EEE', 'Instrumentation'],
      isCommonToAll: false,
      lastUpdated: '2025-01-10',
      updatedBy: 'Admin'
    },
    {
      id: 7,
      name: 'Bosch',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Bosch-logo.svg/1200px-Bosch-logo.svg.png',
      industry: 'Automotive & Industrial',
      package: '7-13 LPA',
      assignedBranches: ['Mechanical', 'ECE', 'EEE', 'Automobile'],
      isCommonToAll: false,
      lastUpdated: '2025-01-09',
      updatedBy: 'Admin'
    },
    {
      id: 8,
      name: 'Intel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Intel_logo.svg/1200px-Intel_logo.svg.png',
      industry: 'Semiconductor & Computing',
      package: '10-20 LPA',
      assignedBranches: ['CSE', 'ECE', 'EEE'],
      isCommonToAll: false,
      lastUpdated: '2025-01-08',
      updatedBy: 'Admin'
    },
    {
      id: 9,
      name: 'Larsen & Toubro',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/L%26T_logo.svg/1200px-L%26T_logo.svg.png',
      industry: 'Engineering & Construction',
      package: '6-12 LPA',
      assignedBranches: ['Mechanical', 'Civil', 'EEE', 'ECE', 'Chemical'],
      isCommonToAll: false,
      lastUpdated: '2025-01-07',
      updatedBy: 'Admin'
    },
    {
      id: 10,
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1200px-Microsoft_logo_%282012%29.svg.png',
      industry: 'Software & Cloud',
      package: '15-25 LPA',
      assignedBranches: [],
      isCommonToAll: true,
      lastUpdated: '2025-01-06',
      updatedBy: 'Admin'
    },
    {
      id: 11,
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
      industry: 'Technology & Internet',
      package: '20-35 LPA',
      assignedBranches: [],
      isCommonToAll: true,
      lastUpdated: '2025-01-05',
      updatedBy: 'Admin'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedFilter === 'common') {
      filtered = filtered.filter(company => company.isCommonToAll);
    } else if (selectedFilter === 'branch-specific') {
      filtered = filtered.filter(company => !company.isCommonToAll);
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, selectedFilter]);

  const toggleBranchAssignment = (companyId, branch) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id === companyId) {
          const updatedBranches = company.assignedBranches.includes(branch)
            ? company.assignedBranches.filter(b => b !== branch)
            : [...company.assignedBranches, branch];
          
          return {
            ...company,
            assignedBranches: updatedBranches,
            lastUpdated: new Date().toISOString().split('T')[0],
            updatedBy: 'Admin'
          };
        }
        return company;
      })
    );
    setHasChanges(true);
  };

  const toggleCommonToAll = (companyId) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id === companyId) {
          return {
            ...company,
            isCommonToAll: !company.isCommonToAll,
            assignedBranches: !company.isCommonToAll ? [] : company.assignedBranches,
            lastUpdated: new Date().toISOString().split('T')[0],
            updatedBy: 'Admin'
          };
        }
        return company;
      })
    );
    setHasChanges(true);
  };

  const saveChanges = () => {
    // Simulate API call to save changes
    setTimeout(() => {
      setHasChanges(false);
      toast.success('Company-branch assignments saved successfully!');
    }, 500);
  };

  const exportConfiguration = () => {
    const config = companies.map(company => ({
      name: company.name,
      isCommonToAll: company.isCommonToAll,
      assignedBranches: company.assignedBranches.sort()
    }));

    const csvContent = [
      ['Company', 'Common to All', 'Assigned Branches'],
      ...config.map(company => [
        company.name,
        company.isCommonToAll ? 'Yes' : 'No',
        company.assignedBranches.join(', ') || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `company_branch_config_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Configuration exported successfully!');
  };

  const commonToAllCount = filteredCompanies.filter(c => c.isCommonToAll).length;
  const branchSpecificCount = filteredCompanies.filter(c => !c.isCommonToAll).length;
  const totalBranchAssignments = filteredCompanies.reduce((sum, company) => sum + company.assignedBranches.length, 0);

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
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Company-Branch Manager</h1>
              <p className="text-lg text-white/90 mt-1">Configure Company Availability by Branch</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-4 w-4" />
              <span>{availableBranches.length} Branches</span>
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
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+2</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-blue-600 mb-1">Total Companies</h3>
            <p className="text-3xl font-bold text-gray-900">{filteredCompanies.length}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+1</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-emerald-600 mb-1">Common to All</h3>
            <p className="text-3xl font-bold text-gray-900">{commonToAllCount}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <ArrowTrendingDownIcon className="h-4 w-4" />
                <span className="text-xs font-medium">-1</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-purple-600 mb-1">Branch Specific</h3>
            <p className="text-3xl font-bold text-gray-900">{branchSpecificCount}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                <span className="text-xs font-medium">+8</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-orange-600 mb-1">Total Assignments</h3>
            <p className="text-3xl font-bold text-gray-900">{totalBranchAssignments}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
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
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">🏢 All Companies</option>
              <option value="common">🌐 Common to All</option>
              <option value="branch-specific">🎓 Branch Specific</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportConfiguration}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export Config</span>
            </button>
            <button
              onClick={saveChanges}
              disabled={!hasChanges}
              className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-200/50' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>{hasChanges ? 'Save Changes' : 'No Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Company Branch Assignments</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{filteredCompanies.length} companies</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Branch Assignments
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.industry}</div>
                        <div className="text-sm font-bold text-green-600">{company.package}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCommonToAll(company.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          company.isCommonToAll ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            company.isCommonToAll ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        company.isCommonToAll 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {company.isCommonToAll ? 'Common to All' : 'Branch Specific'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {company.isCommonToAll ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="font-medium">Available to all branches</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {availableBranches.map((branch) => (
                            <button
                              key={branch}
                              onClick={() => toggleBranchAssignment(company.id, branch)}
                              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                                company.assignedBranches.includes(branch)
                                  ? 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              {branch}
                            </button>
                          ))}
                        </div>
                        {company.assignedBranches.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {company.assignedBranches.length} branch{company.assignedBranches.length > 1 ? 'es' : ''} assigned
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      <div>{company.lastUpdated}</div>
                      <div className="text-xs text-gray-400">by {company.updatedBy}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBranchManager;
