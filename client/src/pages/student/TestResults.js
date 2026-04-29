import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TrophyIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock Test Results Service
const mockTestResultsService = {
  getTestResults: async (testId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock results
    const totalQuestions = 20;
    const correctAnswers = 14;
    const wrongAnswers = 6;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 60;
    
    const questions = [];
    for (let i = 1; i <= totalQuestions; i++) {
      const isCorrect = i <= correctAnswers;
      questions.push({
        id: i,
        question: `Sample question ${i} about ${['Aptitude', 'Reasoning', 'Technical', 'Verbal'][i % 4]}?`,
        userAnswer: isCorrect ? 'A' : 'B',
        correctAnswer: 'A',
        isCorrect,
        explanation: `This is the explanation for question ${i}. The correct answer is A because...`,
        category: ['Aptitude', 'Reasoning', 'Technical', 'Verbal'][i % 4],
        timeSpent: Math.floor(Math.random() * 60) + 20
      });
    }
    
    const categoryPerformance = {
      Aptitude: { total: 5, correct: 4, percentage: 80 },
      Reasoning: { total: 5, correct: 3, percentage: 60 },
      Technical: { total: 5, correct: 4, percentage: 80 },
      Verbal: { total: 5, correct: 3, percentage: 60 }
    };
    
    return {
      testId,
      testName: 'Aptitude Assessment Test',
      testType: 'aptitude',
      score,
      passed,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      unanswered: 0,
      timeSpent: 1847, // seconds
      timeLimit: 3600,
      questions,
      categoryPerformance,
      percentile: Math.floor(Math.random() * 30) + 60,
      rank: Math.floor(Math.random() * 50) + 1,
      totalParticipants: 245,
      passPercentage: 60,
      attemptsAllowed: 3,
      attemptsUsed: 1,
      canRetake: !passed && 1 < 3,
      strengths: ['Numerical ability', 'Technical knowledge'],
      weaknesses: ['Logical reasoning', 'Time management'],
      recommendations: [
        'Practice more logical reasoning questions',
        'Work on time management strategies',
        'Review technical concepts regularly'
      ]
    };
  }
};

const TestResults = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchResults = useCallback(async () => {
    try {
      const data = await mockTestResultsService.getTestResults(testId);
      setResults(data);
    } catch (error) {
      toast.error('Failed to load test results');
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleRetake = () => {
    navigate(`/test/${testId}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results found</p>
        <button onClick={() => navigate('/tests')} className="btn-primary mt-4">
          Back to Tests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="section-title">Test Results</h1>
        <p className="text-gray-600">{results.testName}</p>
      </div>

      {/* Result Banner */}
      <div className={`card p-6 ${results.passed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${results.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {results.passed ? (
                <TrophyIcon className="h-8 w-8 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${results.passed ? 'text-green-800' : 'text-red-800'}`}>
                {results.passed ? 'Congratulations! You Passed!' : 'Test Not Cleared'}
              </h2>
              <p className={results.passed ? 'text-green-700' : 'text-red-700'}>
                {results.passed 
                  ? `You scored ${results.score}%, exceeding the passing criteria of ${results.passPercentage}%`
                  : `You scored ${results.score}%. You need ${results.passPercentage}% to pass.`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{results.score}%</p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            {!results.passed && results.canRetake && (
              <button onClick={handleRetake} className="btn-primary">
                <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
                Retake Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ChartBarIcon className="h-4 w-4 inline mr-1" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'questions'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DocumentTextIcon className="h-4 w-4 inline mr-1" />
          Question Analysis
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LightBulbIcon className="h-4 w-4 inline mr-1" />
          Recommendations
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{results.totalQuestions}</p>
              <p className="text-sm text-gray-600">Total Questions</p>
            </div>
            <div className="card p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{results.correctAnswers}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="card p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{results.wrongAnswers}</p>
              <p className="text-sm text-gray-600">Wrong</p>
            </div>
            <div className="card p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{formatTime(results.timeSpent)}</p>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Category Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(results.categoryPerformance).map(([category, data]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className={`text-sm font-semibold ${getScoreColor(data.percentage)}`}>
                      {data.correct}/{data.total} ({data.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        data.percentage >= 80 ? 'bg-green-500' :
                        data.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance vs Others</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{results.percentile}th</p>
                <p className="text-sm text-gray-600">Percentile</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">#{results.rank}</p>
                <p className="text-sm text-gray-600">Rank</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-600">{results.totalParticipants}</p>
                <p className="text-sm text-gray-600">Participants</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Question-wise Analysis</h3>
            <div className="flex space-x-2">
              <span className="flex items-center text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Correct
              </span>
              <span className="flex items-center text-sm text-red-600">
                <XCircleIcon className="h-4 w-4 mr-1" />
                Wrong
              </span>
            </div>
          </div>

          {results.questions.map((question, index) => (
            <div
              key={question.id}
              className={`card overflow-hidden ${
                question.isCorrect ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
              }`}
            >
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    question.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {question.isCorrect ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5" />
                    )}
                  </span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Question {index + 1}</p>
                    <p className="text-sm text-gray-500">{question.category} • {question.timeSpent}s</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    Your Answer: {question.userAnswer}
                  </span>
                  {expandedQuestion === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedQuestion === index && (
                <div className="p-4 bg-gray-50 border-t">
                  <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Your Answer:</p>
                      <p className={`font-semibold ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {question.userAnswer}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correct Answer:</p>
                      <p className="font-semibold text-green-600">{question.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {results.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center text-green-800">
                    <ArrowRightIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {results.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex items-center text-orange-800">
                    <ArrowRightIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
              Personalized Study Plan
            </h3>
            <div className="space-y-4">
              {results.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <span className="flex-shrink-0 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attempt Info */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Test Attempt Information</h3>
                <p className="text-gray-600 mt-1">
                  Attempt {results.attemptsUsed} of {results.attemptsAllowed}
                </p>
              </div>
              {!results.passed && results.canRetake && (
                <button onClick={handleRetake} className="btn-primary">
                  <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
                  Retake Test ({results.attemptsAllowed - results.attemptsUsed} attempts left)
                </button>
              )}
              {results.passed && (
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Test Cleared!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/tests')}
          className="btn-secondary"
        >
          Back to Tests
        </button>
        {!results.passed && results.canRetake && (
          <button onClick={handleRetake} className="btn-primary">
            <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
            Retake Test
          </button>
        )}
      </div>
    </div>
  );
};

export default TestResults;
