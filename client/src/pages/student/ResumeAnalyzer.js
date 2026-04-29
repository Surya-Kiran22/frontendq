import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockCompanyService } from '../../services/mockData';
import {
  DocumentArrowUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock AI Analysis Service
const mockAIAnalysisService = {
  analyzeResume: async (fileData, userProfile) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all companies
    const companies = await mockCompanyService.getAllCompanies();
    
    // Mock analysis results
    const eligibleCompanies = [];
    const notEligibleCompanies = [];
    
    companies.forEach((company, index) => {
      // Simulate AI eligibility check based on various factors
      const eligibilityScore = Math.random();
      const reasons = [];
      
      if (eligibilityScore > 0.6) {
        // Eligible
        const matchPercentage = Math.floor(70 + Math.random() * 30);
        
        if (matchPercentage > 85) {
          reasons.push('Strong technical skills match');
          reasons.push('CGPA meets requirements');
        } else if (matchPercentage > 75) {
          reasons.push('Good skill alignment');
          reasons.push('Relevant coursework/projects');
        } else {
          reasons.push('Basic eligibility met');
          reasons.push('Consider skill improvement');
        }
        
        eligibleCompanies.push({
          ...company,
          matchPercentage,
          reasons,
          recommendedRoles: company.positions?.slice(0, 2).map(p => p.title) || ['Software Engineer'],
          skillGaps: matchPercentage < 80 ? ['Advanced DSA', 'System Design'] : []
        });
      } else {
        // Not eligible
        const missingRequirements = [];
        
        if (Math.random() > 0.5) {
          missingRequirements.push('CGPA below minimum requirement (8.0+)');
        }
        if (Math.random() > 0.5) {
          missingRequirements.push('Missing required certifications');
        }
        if (Math.random() > 0.5) {
          missingRequirements.push('Skills mismatch - needs more hands-on experience');
        }
        if (missingRequirements.length === 0) {
          missingRequirements.push('High competition - strengthen profile');
        }
        
        notEligibleCompanies.push({
          ...company,
          missingRequirements,
          suggestions: [
            'Improve CGPA to 8.0 or above',
            'Complete relevant certifications',
            'Build more projects in ' + company.industry,
            'Practice coding problems regularly'
          ]
        });
      }
    });
    
    // Sort eligible by match percentage
    eligibleCompanies.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return {
      success: true,
      analysis: {
        totalCompanies: companies.length,
        eligibleCount: eligibleCompanies.length,
        notEligibleCount: notEligibleCompanies.length,
        overallMatch: Math.floor(60 + Math.random() * 25),
        skills: {
          technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          soft: ['Communication', 'Problem Solving', 'Teamwork'],
          missing: ['Docker', 'Kubernetes', 'AWS', 'System Design']
        },
        cgpa: userProfile.cgpa || 8.5,
        backlogs: userProfile.backlogs || 0,
        recommendations: [
          'Focus on improving System Design skills',
          'Complete AWS certification for cloud roles',
          'Build 2-3 full-stack projects',
          'Practice LeetCode medium/hard problems'
        ],
        eligibleCompanies,
        notEligibleCompanies
      }
    };
  }
};

const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('eligible');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        if (selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
          setFile(selectedFile);
          toast.success('Resume uploaded successfully!');
        } else {
          toast.error('File size should be less than 5MB');
        }
      } else {
        toast.error('Please upload a PDF or Word document');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Read file as base64 (mock)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await mockAIAnalysisService.analyzeResume(
          e.target.result,
          { cgpa: user?.cgpa || 8.5, backlogs: user?.backlogs || 0 }
        );
        
        if (result.success) {
          setAnalysis(result.analysis);
          toast.success('Resume analysis complete!');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setActiveTab('eligible');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render Upload Section
  const renderUploadSection = () => (
    <div className="space-y-6">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
            <SparklesIcon className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Resume Analyzer</h3>
          <p className="text-gray-600 max-w-lg mx-auto">
            Upload your resume and our AI will analyze it to show which companies you're eligible for and provide personalized recommendations
          </p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <DocumentTextIcon className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Change file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <DocumentArrowUpIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your resume here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-gray-400">Supports PDF, DOC, DOCX (Max 5MB)</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Select File
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="btn-primary py-3 px-8 text-lg font-semibold rounded-xl disabled:opacity-50"
          >
            {analyzing ? (
              <span className="flex items-center">
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                Analyzing with AI...
              </span>
            ) : (
              <span className="flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Analyze Resume
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Company Matching</h4>
          <p className="text-sm text-gray-600">See which companies you're eligible for</p>
        </div>
        <div className="card p-4 text-center">
          <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <ChartPieIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Skill Analysis</h4>
          <p className="text-sm text-gray-600">Get detailed skill gap analysis</p>
        </div>
        <div className="card p-4 text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <LightBulbIcon className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Recommendations</h4>
          <p className="text-sm text-gray-600">Personalized improvement tips</p>
        </div>
      </div>
    </div>
  );

  // Render Analysis Results
  const renderAnalysisResults = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-3xl font-bold text-green-600">{analysis.eligibleCount}</p>
          <p className="text-sm text-gray-600">Eligible Companies</p>
        </div>
        <div className="card p-4 text-center bg-gradient-to-br from-red-50 to-orange-50">
          <p className="text-3xl font-bold text-red-600">{analysis.notEligibleCount}</p>
          <p className="text-sm text-gray-600">Need Improvement</p>
        </div>
        <div className="card p-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-3xl font-bold text-blue-600">{analysis.overallMatch}%</p>
          <p className="text-sm text-gray-600">Overall Match</p>
        </div>
        <div className="card p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50">
          <p className="text-3xl font-bold text-purple-600">{analysis.skills.technical.length}</p>
          <p className="text-sm text-gray-600">Skills Detected</p>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
          Skills Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.technical.map((skill, idx) => (
                <span key={idx} className="badge-primary">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Soft Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.soft.map((skill, idx) => (
                <span key={idx} className="badge bg-blue-100 text-blue-800">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              Skills to Learn
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.missing.map((skill, idx) => (
                <span key={idx} className="badge bg-orange-100 text-orange-800">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
          AI Recommendations
        </h3>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start">
              <ArrowRightIcon className="h-4 w-4 mr-2 text-yellow-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('eligible')}
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'eligible'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Eligible ({analysis.eligibleCount})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('notEligible')}
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'notEligible'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Needs Work ({analysis.notEligibleCount})
          </span>
        </button>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {activeTab === 'eligible' ? (
          analysis.eligibleCompanies.length > 0 ? (
            analysis.eligibleCompanies.map((company) => (
              <div key={company._id} className="card p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3">
                        <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-500">{company.industry}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${company.matchPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-green-600">{company.matchPercentage}% Match</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {company.recommendedRoles.map((role, idx) => (
                          <span key={idx} className="badge-primary text-xs">{role}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-green-700">Why eligible:</span>{' '}
                        {company.reasons.join(', ')}
                      </p>
                    </div>

                    {company.skillGaps.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-orange-600">
                          <span className="font-medium">Improve:</span>{' '}
                          {company.skillGaps.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/companies/${company._id}`)}
                    className="btn-outline text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No eligible companies found. Keep improving your skills!</p>
            </div>
          )
        ) : (
          analysis.notEligibleCompanies.length > 0 ? (
            analysis.notEligibleCompanies.map((company) => (
              <div key={company._id} className="card p-5 border-l-4 border-red-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mr-3">
                        <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-500">{company.industry}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-red-700 mb-1">Missing Requirements:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {company.missingRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Suggestions to improve:</p>
                      <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                        {company.suggestions.slice(0, 3).map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Great job! You're eligible for all companies.</p>
            </div>
          )
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Analyze Another Resume
        </button>
        <button
          onClick={() => window.print()}
          className="btn-outline flex items-center"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="section-title">Resume Analyzer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          AI-powered resume analysis to check your eligibility for top companies
        </p>
      </div>

      {analysis ? renderAnalysisResults() : renderUploadSection()}
    </div>
  );
};

export default ResumeAnalyzer;
