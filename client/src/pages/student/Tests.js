import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockTestService } from '../../services/mockData';
import {
  ClockIcon,
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  CalendarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  BeakerIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Generate mock test history
const generateMockTestHistory = () => {
  const history = [];
  const testTypes = ['aptitude', 'coding', 'ai-interview'];
  const statuses = ['completed', 'in-progress', 'not-attempted'];
  
  for (let i = 0; i < 10; i++) {
    const type = testTypes[Math.floor(Math.random() * testTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const score = status === 'completed' ? Math.floor(Math.random() * 40) + 60 : null;
    
    history.push({
      id: `history_${i}`,
      testId: `test_${i}`,
      testName: `${type.charAt(0).toUpperCase() + type.slice(1)} Test ${i + 1}`,
      type,
      status,
      score,
      timeSpent: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
      completedAt: status === 'completed' ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString() : null,
      attempts: Math.floor(Math.random() * 3) + 1,
      passed: score >= 60
    });
  }
  
  return history.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
};

const Tests = () => {
  const navigate = useNavigate();
  
  const [tests, setTests] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchTests();
    setTestHistory(generateMockTestHistory());
  }, []);

  const fetchTests = async () => {
    try {
      // Use mock data
      const testsData = await mockTestService.getAllTests();
      const mockTests = testsData.map(test => ({
        ...test,
        attemptStatus: ['completed', 'in-progress', 'not-attempted'][Math.floor(Math.random() * 3)],
        attemptCount: Math.floor(Math.random() * 3),
        bestScore: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : null
      }));
      setTests(mockTests);
    } catch (error) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (test) => {
    if (test.attemptStatus === 'in-progress') {
      // Resume existing test
      navigate(`/test/${test._id}`);
    } else if (test.attemptStatus === 'completed' && test.maxAttempts > 0) {
      // Check if attempts remaining
      if (test.attemptCount < test.maxAttempts) {
        navigate(`/test/${test._id}`);
      } else {
        toast.error('Maximum attempts reached');
      }
    } else if (test.attemptStatus === 'not-attempted' || !test.attemptStatus) {
      // Start new test
      navigate(`/test/${test._id}`);
    }
  };

  const getTestTypeIcon = (type) => {
    switch (type) {
      case 'aptitude':
        return <ClockIcon className="h-6 w-6" />;
      case 'coding':
        return <CodeBracketIcon className="h-6 w-6" />;
      case 'ai-interview':
        return <ChatBubbleLeftRightIcon className="h-6 w-6" />;
      default:
        return <ClipboardDocumentListIcon className="h-6 w-6" />;
    }
  };

  const getTestTypeColor = (type) => {
    switch (type) {
      case 'aptitude':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'coding':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ai-interview':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'not-attempted':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-attempted':
        return 'Not Attempted';
      default:
        return 'Not Attempted';
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesFilter = filter === 'all' || test.type === filter;
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getOverallStats = () => {
    const completed = testHistory.filter(t => t.status === 'completed');
    const totalTime = completed.reduce((sum, t) => sum + t.timeSpent, 0);
    const avgScore = completed.length > 0 
      ? Math.round(completed.reduce((sum, t) => sum + (t.score || 0), 0) / completed.length)
      : 0;
    const passed = completed.filter(t => t.passed).length;
    
    return {
      totalTests: testHistory.length,
      completed: completed.length,
      avgScore,
      totalTime: formatTime(totalTime),
      passed,
      passRate: completed.length > 0 ? Math.round((passed / completed.length) * 100) : 0
    };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="section-title">Online Tests</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Take aptitude tests, coding challenges, and AI interviews to prepare for placements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalTests}</p>
          <p className="text-sm text-gray-600">Total Tests</p>
        </div>

        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <ChartBarIcon className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.avgScore}%</p>
          <p className="text-sm text-gray-600">Avg Score</p>
        </div>

        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
            <ClockIcon className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.totalTime}</p>
          <p className="text-sm text-gray-600">Total Time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 px-4 font-medium text-sm flex items-center ${
            activeTab === 'available'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BeakerIcon className="h-4 w-4 mr-2" />
          Available Tests
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-medium text-sm flex items-center ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AcademicCapIcon className="h-4 w-4 mr-2" />
          Test History ({testHistory.length})
        </button>
      </div>

      {/* Available Tests Tab */}
      {activeTab === 'available' && (
        <>
          {/* Filters */}
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="input pl-12"
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <select
                  className="input"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Tests</option>
                  <option value="aptitude">Aptitude Tests</option>
                  <option value="coding">Coding Tests</option>
                  <option value="ai-interview">AI Interviews</option>
                </select>
              </div>
            </div>
          </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <div key={test._id} className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getTestTypeColor(test.type)}`}>
                        {getTestTypeIcon(test.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.companyName}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{test.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {test.duration} minutes
                      </div>
                      
                      <div className="flex items-center">
                        <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                        {test.questions?.length || 0} questions
                      </div>
                      
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Max attempts: {test.maxAttempts || 1}
                      </div>
                      
                      {test.attemptCount > 0 && (
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          Attempts: {test.attemptCount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end space-y-2">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.attemptStatus)}`}>
                      {getStatusText(test.attemptStatus)}
                    </span>
                    
                    {/* Score */}
                    {test.bestScore !== null && (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{test.bestScore}%</p>
                        <p className="text-xs text-gray-500">Best Score</p>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button
                      onClick={() => handleStartTest(test)}
                      disabled={test.attemptStatus === 'completed' && test.attemptCount >= (test.maxAttempts || 1)}
                      className={`btn-primary flex items-center text-sm ${
                        test.attemptStatus === 'completed' && test.attemptCount >= (test.maxAttempts || 1)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {test.attemptStatus === 'in-progress' ? (
                        <>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : test.attemptStatus === 'completed' && test.attemptCount >= (test.maxAttempts || 1) ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : test.attemptStatus === 'completed' ? (
                        <>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Retake
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Start Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Proctoring Warning */}
                {test?.proctoring && (test?.proctoring?.enableWebcam || test?.proctoring?.enableFullscreen) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        This test requires {test?.proctoring?.enableWebcam && 'webcam access'}{test?.proctoring?.enableWebcam && test?.proctoring?.enableFullscreen && ' and '}{test?.proctoring?.enableFullscreen && 'fullscreen mode'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
              <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No tests are available at the moment'}
            </p>
          </div>
        )}
      </div>
      </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {testHistory.length > 0 ? (
            testHistory.map((test) => (
              <div key={test.id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${getTestTypeColor(test.type)}`}>
                          {test.type === 'aptitude' ? <ClockIcon className="h-5 w-5" /> :
                           test.type === 'coding' ? <CodeBracketIcon className="h-5 w-5" /> :
                           <ChatBubbleLeftRightIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                          <p className="text-sm text-gray-500">Completed on {new Date(test.completedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-600">Time: {formatTime(test.timeSpent)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ArrowPathIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-600">Attempts: {test.attempts}</span>
                        </div>
                        {test.score && (
                          <div className="flex items-center">
                            <span className={`text-sm font-semibold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                              Score: {test.score}%
                            </span>
                            {test.passed ? (
                              <CheckCircleIcon className="h-4 w-4 ml-1 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 ml-1 text-red-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col items-end space-y-2">
                      <button
                        onClick={() => navigate(`/test-results/${test.testId}`)}
                        className="btn-outline text-sm flex items-center"
                      >
                        View Results
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                      
                      {test.status === 'completed' && !test.passed && (
                        <button
                          onClick={() => navigate(`/test/${test.testId}`)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retake Test
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No test history yet</h3>
              <p className="text-gray-600 mb-4">Start taking tests to see your progress here</p>
              <button
                onClick={() => setActiveTab('available')}
                className="btn-primary"
              >
                Browse Available Tests
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;
