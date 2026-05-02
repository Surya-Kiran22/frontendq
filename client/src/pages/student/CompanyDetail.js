import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  CalculatorIcon,
  PuzzlePieceIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [userTracking, setUserTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationNotes, setApplicationNotes] = useState('');
  const [imageError, setImageError] = useState(false);

  const fetchCompanyDetails = useCallback(async () => {
    try {
      const companyData = await companyService.getCompanyById(id);
      setCompany(companyData);
      
      // Mock user tracking data
      const mockTracking = Math.random() > 0.5 ? {
        status: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Received'][Math.floor(Math.random() * 4)],
        notes: 'Application submitted successfully'
      } : null;
      setUserTracking(mockTracking);
      
      if (mockTracking) {
        setApplicationStatus(mockTracking.status);
        setApplicationNotes(mockTracking.notes || '');
      }
    } catch (error) {
      toast.error('Failed to load company details');
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const trackingData = {
        status: applicationStatus || 'Applied',
        notes: applicationNotes,
        updatedAt: new Date().toISOString()
      };
      
      setUserTracking(trackingData);
      setShowApplicationModal(false);
      toast.success('Application status updated successfully');
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoundIcon = (roundName) => {
    const round = roundName?.toLowerCase() || '';
    if (round.includes('aptitude') || round.includes('cognitive') || round.includes('assessment')) {
      return CalculatorIcon;
    }
    if (round.includes('coding') || round.includes('programming') || round.includes('technical test')) {
      return CodeBracketIcon;
    }
    if (round.includes('technical') || round.includes('system')) {
      return ComputerDesktopIcon;
    }
    if (round.includes('group') || round.includes('gd')) {
      return UserGroupIcon;
    }
    if (round.includes('hr') || round.includes('personal') || round.includes('managerial')) {
      return ChatBubbleLeftRightIcon;
    }
    if (round.includes('essay') || round.includes('writing')) {
      return DocumentTextIcon;
    }
    if (round.includes('case')) {
      return PuzzlePieceIcon;
    }
    return ClipboardDocumentListIcon;
  };

  const getInterviewTypeColor = (roundName) => {
    const round = roundName?.toLowerCase() || '';
    if (round.includes('aptitude')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (round.includes('coding')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (round.includes('technical')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (round.includes('group')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (round.includes('hr')) return 'bg-green-100 text-green-800 border-green-200';
    if (round.includes('essay')) return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4">
          <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
        <button
          onClick={() => navigate('/companies')}
          className="mt-4 btn-primary"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Company Header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 bg-white rounded-xl p-2 shadow-lg">
                  {company.logo && !imageError ? (
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <span className="text-2xl font-bold text-gray-400">{company.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{company.name}</h1>
                <p className="text-blue-100 text-lg">{company.industry}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {company.package}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {company.location}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {userTracking && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userTracking.status)}`}>
                  {userTracking.status}
                </span>
              )}
              
              <button
                onClick={() => setShowApplicationModal(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
              >
                {userTracking ? 'Update Status' : 'Apply Now'}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">{company.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center text-sm">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Visit Date</p>
                <p className="text-gray-600">{formatDate(company.visitDate || new Date().toISOString())}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
                <BriefcaseIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Package</p>
                <p className="text-gray-600">{company.package || 'Not disclosed'}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mr-3">
                <AcademicCapIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Eligibility</p>
                <p className="text-gray-600">CGPA {company.eligibility?.cgpa || 7.0}+</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mr-3">
                <GlobeAltIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Website</p>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BuildingOfficeIcon },
              { id: 'interview-process', name: 'Interview Process', icon: ClipboardDocumentListIcon },
              { id: 'positions', name: 'Positions', icon: BriefcaseIcon },
              { id: 'practice', name: 'Practice', icon: AcademicCapIcon },
              { id: 'mock-interviews', name: 'Mock Interviews', icon: DocumentTextIcon },
              { id: 'skills', name: 'Skills & Certifications', icon: CheckCircleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h3>
                <p className="text-gray-700">{company.description}</p>
              </div>

              {/* Detailed Description */}
              {company.detailedDescription && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h3>
                  <p className="text-gray-700">{company.detailedDescription}</p>
                </div>
              )}

              {/* Requirements */}
              {company.requirements && (
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <p className="text-gray-700">{company.requirements}</p>
                </div>
              )}

              {/* Importance */}
              {company.importance && (
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Company is Important</h3>
                  <p className="text-gray-700">{company.importance}</p>
                </div>
              )}

              {/* Interview Format / Selection Process */}
              {company.selectionProcess && company.selectionProcess.length > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg p-6 border border-primary-100">
                  <div className="flex items-center mb-4">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Interview Format & Selection Process</h3>
                  </div>
                  
                  {/* Interview Type Legend */}
                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">🧮 Aptitude</span>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">💻 Coding</span>
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800">🔧 Technical</span>
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">👥 Group Discussion</span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">💬 HR Interview</span>
                  </div>

                  <div className="space-y-4">
                    {company.selectionProcess.map((step, index) => {
                      const RoundIcon = getRoundIcon(step.round);
                      const colorClass = getInterviewTypeColor(step.round);
                      
                      return (
                        <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="flex-shrink-0">
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${colorClass}`}>
                              <RoundIcon className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-900">{step.round}</h4>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Round {index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            {step.duration && (
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                Duration: {step.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>📋 Total Rounds:</strong> {company.selectionProcess.length} | 
                      <strong> ⏱️ Estimated Total Time:</strong> {' '}
                      {company.selectionProcess.reduce((total, step) => {
                        const minutes = parseInt(step.duration?.match(/\d+/)?.[0] || 0);
                        return total + minutes;
                      }, 0)} minutes
                    </p>
                  </div>
                </div>
              )}

              {company.tipsAndResources?.generalTips && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">General Tips</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {company.tipsAndResources.generalTips.map((tip, index) => (
                      <li key={index} className="text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Interview Process Tab */}
          {activeTab === 'interview-process' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-primary-600 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900">Interview Process & Selection Rounds</h3>
                <p className="text-gray-600">Complete recruitment procedure for {company.name}</p>
              </div>

              {company.selectionProcess && company.selectionProcess.length > 0 ? (
                <div className="space-y-6">
                  {/* Interview Type Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { type: 'Aptitude', icon: CalculatorIcon, color: 'bg-blue-100 text-blue-800', desc: 'Quantitative, Logical, Verbal' },
                      { type: 'Coding', icon: CodeBracketIcon, color: 'bg-purple-100 text-purple-800', desc: 'Programming Test' },
                      { type: 'Technical', icon: ComputerDesktopIcon, color: 'bg-indigo-100 text-indigo-800', desc: 'Technical Skills' },
                      { type: 'Group Discussion', icon: UserGroupIcon, color: 'bg-yellow-100 text-yellow-800', desc: 'Communication' },
                      { type: 'HR Interview', icon: ChatBubbleLeftRightIcon, color: 'bg-green-100 text-green-800', desc: 'Behavioral & Fit' },
                      { type: 'Essay/Writing', icon: DocumentTextIcon, color: 'bg-pink-100 text-pink-800', desc: 'Written Test' }
                    ].map((item, idx) => (
                      <div key={idx} className={`${item.color} rounded-lg p-3 text-center`}>
                        <item.icon className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{item.type}</p>
                        <p className="text-xs opacity-75">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Rounds */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Selection Rounds</h4>
                    
                    <div className="space-y-4">
                      {company.selectionProcess.map((step, index) => {
                        const RoundIcon = getRoundIcon(step.round);
                        const colorClass = getInterviewTypeColor(step.round);
                        
                        return (
                          <div key={index} className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-primary-500">
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 h-12 w-12 rounded-full ${colorClass} flex items-center justify-center`}>
                                <RoundIcon className="h-6 w-6" />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <h5 className="text-lg font-semibold text-gray-900">{step.round}</h5>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                      Round {index + 1} of {company.selectionProcess.length}
                                    </span>
                                    {step.duration && (
                                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {step.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 mt-2">{step.description}</p>
                                
                                {/* Round-specific tips */}
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700">
                                    <strong>💡 Tip:</strong> {' '}
                                    {step.round.toLowerCase().includes('aptitude') && 'Practice quantitative, logical reasoning, and verbal ability questions daily.'}
                                    {step.round.toLowerCase().includes('coding') && 'Focus on data structures, algorithms, and problem-solving patterns.'}
                                    {step.round.toLowerCase().includes('technical') && 'Review core CS concepts, your projects, and be ready to write code.'}
                                    {step.round.toLowerCase().includes('group') && 'Stay updated on current affairs and practice structured communication.'}
                                    {step.round.toLowerCase().includes('hr') && 'Prepare for behavioral questions, know your resume well, and research the company.'}
                                    {!step.round.toLowerCase().match(/aptitude|coding|technical|group|hr/) && 'Be well-prepared, confident, and research about the company thoroughly.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-primary-600 text-white rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-3">📊 Interview Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">{company.selectionProcess.length}</p>
                        <p className="text-sm">Total Rounds</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">
                          {company.selectionProcess.reduce((total, step) => {
                            const minutes = parseInt(step.duration?.match(/\d+/)?.[0] || 0);
                            return total + minutes;
                          }, 0)}
                        </p>
                        <p className="text-sm">Total Minutes</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">
                          {company.selectionProcess.filter(s => s.round.toLowerCase().includes('technical') || s.round.toLowerCase().includes('coding')).length}
                        </p>
                        <p className="text-sm">Technical Rounds</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">
                          {company.selectionProcess.filter(s => s.round.toLowerCase().includes('hr') || s.round.toLowerCase().includes('personal')).length}
                        </p>
                        <p className="text-sm">HR Rounds</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Interview process details not available</p>
                </div>
              )}
            </div>
          )}

          {/* Positions Tab */}
          {activeTab === 'positions' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Available Roles at {company.name}</h3>
                <p className="text-gray-600">Explore the different positions available</p>
              </div>
              {company.roles && company.roles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.roles.map((role, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{role.title}</h4>
                          <p className="text-sm text-gray-600">{role.department}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {role.salaryPackage}
                      </span>
                    </div>
                  ))}
                </div>
              ) : company.positions && company.positions.length > 0 ? (
                company.positions.map((position, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                        <p className="text-sm text-gray-600">{position.department}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {position.salaryPackage}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Branches:</span> {position.eligibility.branches.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Min CGPA:</span> {position.eligibility.minCGPA}
                          </div>
                          <div>
                            <span className="font-medium">Max Backlogs:</span> {position.eligibility.maxBacklogs}
                          </div>
                          <div>
                            <span className="font-medium">Year of Passing:</span> {position.eligibility.yearOfPassing.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Required</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.skillsRequired.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {position.certificationsRequired && position.certificationsRequired.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                          <div className="space-y-1">
                            {position.certificationsRequired.map((cert, certIndex) => (
                              <div key={certIndex} className="flex items-center text-sm">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                <span>{cert.name}</span>
                                {cert.preferred && (
                                  <span className="ml-2 text-xs text-gray-500">(Preferred)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {position.jobDescription && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Job Description</h4>
                          <p className="text-sm text-gray-700">{position.jobDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No positions available</p>
                </div>
              )}
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Practice Materials</h3>
                <p className="text-gray-600">Prepare for {company.name} interviews with these resources</p>
              </div>

              {/* Interview Process Example */}
              {company.selectionProcess && company.selectionProcess.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Interview Process Example</h4>
                  <div className="space-y-3">
                    {company.selectionProcess.map((step, index) => {
                      const RoundIcon = getRoundIcon(step.round);
                      const colorClass = getInterviewTypeColor(step.round);
                      return (
                        <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${colorClass} flex items-center justify-center mr-3`}>
                            <RoundIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{step.round}</p>
                            <p className="text-xs text-gray-600">{step.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {company.preparationMaterial?.practice && company.preparationMaterial.practice.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.preparationMaterial.practice.map((material, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{material.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          material.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          material.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {material.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          <ClockIcon className="h-4 w-4 inline mr-1" />
                          {material.duration}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {material.type}
                        </span>
                      </div>

                      {material.resourceUrl && (
                        <button
                          onClick={() => window.open(material.resourceUrl, '_blank')}
                          className="mt-3 w-full btn-outline text-sm"
                        >
                          Start Practice
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No practice materials available</p>
                </div>
              )}
            </div>
          )}

          {/* Mock Interviews Tab */}
          {activeTab === 'mock-interviews' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Mock Interviews</h3>
                <p className="text-gray-600">Practice with these mock interview questions for {company.name}</p>
              </div>

              {/* Original Interview Process */}
              {company.selectionProcess && company.selectionProcess.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Original Interview Process</h4>
                  <p className="text-sm text-gray-600 mb-4">Follow the actual interview process for {company.name}:</p>
                  <div className="space-y-3">
                    {company.selectionProcess.map((step, index) => {
                      const RoundIcon = getRoundIcon(step.round);
                      const colorClass = getInterviewTypeColor(step.round);
                      return (
                        <div key={index} className="flex items-center bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClass} flex items-center justify-center mr-3`}>
                            <RoundIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{step.round}</p>
                            <p className="text-xs text-gray-600">{step.description}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/tests?company=${company.id}&round=${step.round}`)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Start
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {company.preparationMaterial?.mockInterviews && company.preparationMaterial.mockInterviews.length > 0 ? (
                <div className="space-y-6">
                  {company.preparationMaterial.mockInterviews.map((mock, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{mock.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{mock.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {mock.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 inline mr-1" />
                            {mock.duration}
                          </span>
                        </div>
                      </div>

                      {mock.questions && mock.questions.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Sample Questions:</h5>
                          <ul className="space-y-2">
                            {mock.questions.map((question, qIndex) => (
                              <li key={qIndex} className="text-sm text-gray-700">
                                <span className="font-medium">{qIndex + 1}.</span> {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {mock.tips && mock.tips.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Tips:</h5>
                          <ul className="space-y-1">
                            {mock.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No mock interviews available</p>
                </div>
              )}
            </div>
          )}

          {/* Skills & Certifications Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Skills & Certifications</h3>
                <p className="text-gray-600">Essential skills and certifications to crack {company.name} interviews</p>
              </div>

              {/* Required Courses */}
              {company.requiredCourses && company.requiredCourses.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Required Courses to Complete</h4>
                  <p className="text-sm text-gray-600 mb-4">Complete these courses and upload certificates in your profile:</p>
                  <div className="space-y-3">
                    {company.requiredCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{course.name}</p>
                            <p className="text-xs text-gray-600">Platform: {course.platform}</p>
                          </div>
                        </div>
                        <a 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-outline text-sm px-3 py-1"
                        >
                          View Course
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {company.tipsAndResources?.importantSkills && company.tipsAndResources.importantSkills.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Important Skills</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.tipsAndResources.importantSkills.map((skill, index) => (
                      <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {company.tipsAndResources?.recommendedCertifications && company.tipsAndResources.recommendedCertifications.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recommended Certifications</h4>
                  <div className="space-y-4">
                    {company.tipsAndResources.recommendedCertifications.map((cert, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{cert.name}</h5>
                            <p className="text-sm text-gray-600">{cert.provider}</p>
                          </div>
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500 text-sm"
                            >
                              Learn More →
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{cert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {company.tipsAndResources?.studyMaterials && company.tipsAndResources.studyMaterials.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Study Materials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.tipsAndResources.studyMaterials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{material.title}</h5>
                          <p className="text-sm text-gray-600">{material.type}</p>
                        </div>
                        {material.url && (
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-sm"
                          >
                            Access
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Status Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {userTracking ? 'Update Application Status' : 'Apply to ' + company.name}
              </h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  className="input"
                  value={applicationStatus}
                  onChange={(e) => setApplicationStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Resume Shortlisted">Resume Shortlisted</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="input"
                  rows="3"
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  placeholder="Add any notes about your application..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {userTracking ? 'Update' : 'Apply'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
