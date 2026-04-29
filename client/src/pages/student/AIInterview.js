import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProfileService } from '../../services/mockData';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock AI Interview Service
const mockAIInterviewService = {
  questions: [
    {
      id: 1,
      question: "Tell me about yourself and your background in software development.",
      type: "introduction",
      expectedPoints: ["Education background", "Technical skills", "Projects experience", "Career goals"],
      duration: 120
    },
    {
      id: 2,
      question: "What is your strongest programming language and why?",
      type: "technical",
      expectedPoints: ["Language expertise", "Projects using it", "Frameworks knowledge", "Problem-solving ability"],
      duration: 90
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame the difficulties.",
      type: "behavioral",
      expectedPoints: ["Project description", "Challenges faced", "Solution approach", "Results achieved", "Lessons learned"],
      duration: 180
    },
    {
      id: 4,
      question: "How do you stay updated with the latest technology trends?",
      type: "technical",
      expectedPoints: ["Learning resources", "Community involvement", "Practical application", "Continuous learning mindset"],
      duration: 90
    },
    {
      id: 5,
      question: "Where do you see yourself in 5 years?",
      type: "career",
      expectedPoints: ["Career goals", "Skill development", "Leadership aspirations", "Company alignment"],
      duration: 120
    }
  ],

  analyzeResponse: async (response, question) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const wordCount = response.split(' ').length;
    const score = Math.min(100, Math.max(40, wordCount * 2 + Math.floor(Math.random() * 20)));
    
    const feedback = [];
    if (wordCount < 30) {
      feedback.push("Try to provide more detailed responses");
    } else if (wordCount > 100) {
      feedback.push("Good detailed response");
    }
    
    if (response.includes('example') || response.includes('project')) {
      feedback.push("Great use of examples");
    }
    
    const detectedPoints = question.expectedPoints.filter(point => 
      response.toLowerCase().includes(point.toLowerCase().split(' ')[0])
    ).length;
    
    return {
      score,
      wordCount,
      detectedPoints,
      totalPoints: question.expectedPoints.length,
      feedback: feedback.length > 0 ? feedback : ["Good response! Keep practicing."],
      sentiment: score > 70 ? 'positive' : score > 50 ? 'neutral' : 'needs_improvement'
    };
  },

  generateFinalReport: (responses) => {
    const avgScore = Math.round(
      responses.reduce((sum, r) => sum + r.analysis.score, 0) / responses.length
    );
    
    const strengths = [];
    const improvements = [];
    
    if (avgScore > 70) {
      strengths.push("Clear communication");
      strengths.push("Good technical knowledge");
    }
    if (responses.some(r => r.analysis.wordCount > 80)) {
      strengths.push("Detailed responses");
    }
    
    if (avgScore < 80) {
      improvements.push("Provide more specific examples");
    }
    if (responses.some(r => r.analysis.wordCount < 40)) {
      improvements.push("Elaborate more on your answers");
    }
    
    return {
      overallScore: avgScore,
      totalQuestions: responses.length,
      completedQuestions: responses.filter(r => r.response).length,
      averageWordsPerAnswer: Math.round(
        responses.reduce((sum, r) => sum + r.analysis.wordCount, 0) / responses.length
      ),
      strengths: strengths.length > 0 ? strengths : ["Good participation"],
      improvements: improvements.length > 0 ? improvements : ["Keep practicing!"],
      recommendation: avgScore >= 80 ? 'Strong Candidate' : avgScore >= 60 ? 'Promising' : 'Needs Improvement'
    };
  }
};

const AIInterview = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [step, setStep] = useState('setup'); // setup, intro, interview, reviewing, complete
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPlacementStatus();
  }, []);

  const checkPlacementStatus = async () => {
    try {
      const profile = await mockProfileService.getProfile();
      const placed = profile.profile?.placementStatus === 'Placed';
      setIsPlaced(placed);
    } catch (error) {
      // Error checking placement status
    } finally {
      setLoading(false);
    }
  };

  const handleNext = useCallback(async () => {
    if (currentResponse.trim()) {
      setAnalyzing(true);
      
      const analysis = await mockAIInterviewService.analyzeResponse(
        currentResponse,
        mockAIInterviewService.questions[currentQuestion]
      );
      
      const newResponse = {
        question: mockAIInterviewService.questions[currentQuestion],
        response: currentResponse,
        analysis
      };
      
      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      setAnalyzing(false);
      
      if (currentQuestion < mockAIInterviewService.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setCurrentResponse('');
        setTimer(mockAIInterviewService.questions[currentQuestion + 1].duration);
      } else {
        setStep('reviewing');
        const report = mockAIInterviewService.generateFinalReport(updatedResponses);
        setFinalReport(report);
        setStep('complete');
      }
    }
  }, [currentResponse, currentQuestion, responses]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (step === 'interview' && timer > 0 && !analyzing) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer, analyzing, handleNext]);

  // Initialize camera
  useEffect(() => {
    if (cameraEnabled && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          
          // Start recording with roll number prefix
          recordedChunksRef.current = [];
          mediaRecorderRef.current = new MediaRecorder(stream);
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const rollNumber = '23761A05XX'; // In real app, get from auth context
            const fileName = `${rollNumber}_ai_interview_${Date.now()}.webm`;
            
            // In a real app, this would upload to a server
            console.log(`Interview recording saved as: ${fileName}`, blob);
            
            recordedChunksRef.current = [];
          };
          
          mediaRecorderRef.current.start();
        })
        .catch(err => {
          toast.error('Could not access camera');
          setCameraEnabled(false);
        });
    }
    
    // Cleanup on unmount or when camera is disabled
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [cameraEnabled]);

  const startInterview = () => {
    setStep('intro');
    setTimeout(() => {
      setStep('interview');
      setTimer(mockAIInterviewService.questions[0].duration);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Screen
  const renderSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
            <SparklesIcon className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isPlaced ? 'AI Practice Mode' : 'AI Mock Interview'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isPlaced 
              ? 'Practice your interview skills with AI feedback (Practice Mode Only)'
              : 'Practice with our AI interviewer and get instant feedback on your responses'
            }
          </p>
        </div>

        {/* Placement Warning */}
        {isPlaced && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-900">Practice Mode Only</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Since you are already placed, you can only use this for practice. Mock interview is disabled for placed students.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Interview Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {isPlaced ? 'Practice Details' : 'Interview Details'}
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                {mockAIInterviewService.questions.length} questions (Mix of technical & behavioral)
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                Estimated duration: 10-15 minutes
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                AI-powered feedback on each response
              </li>
              {isPlaced && (
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                  Practice mode - no official recording
                </li>
              )}
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                Detailed performance report at the end
              </li>
            </ul>
          </div>

          {/* Device Setup */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Device Setup</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`p-4 rounded-lg border-2 flex flex-col items-center transition-colors ${
                  cameraEnabled 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <VideoCameraIcon className={`h-8 w-8 mb-2 ${cameraEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{cameraEnabled ? 'Camera On' : 'Enable Camera'}</span>
              </button>
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-4 rounded-lg border-2 flex flex-col items-center transition-colors ${
                  micEnabled 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MicrophoneIcon className={`h-8 w-8 mb-2 ${micEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{micEnabled ? 'Mic On' : 'Enable Mic'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Camera and microphone are optional but recommended for better practice
            </p>
          </div>

          {/* Tips Toggle */}
          <div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <LightBulbIcon className="h-4 w-4 mr-1" />
              {showTips ? 'Hide Tips' : 'Show Interview Tips'}
              {showTips ? (
                <ChevronUpIcon className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              )}
            </button>
            
            {showTips && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Interview Tips:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                  <li>• Provide specific examples from your experience</li>
                  <li>• Keep responses between 1-2 minutes</li>
                  <li>• Be honest and authentic in your answers</li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={startInterview}
            className="btn-primary w-full py-3 text-lg font-semibold"
          >
            Start AI Interview
            <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
          </button>
        </div>
      </div>
    </div>
  );

  // Intro Screen
  const renderIntro = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-pulse">
          <SparklesIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Interviewer is Ready</h2>
        <p className="text-gray-600">Preparing your first question...</p>
      </div>
    </div>
  );

  // Interview Screen
  const renderInterview = () => {
    const question = mockAIInterviewService.questions[currentQuestion];
    const progress = ((currentQuestion) / mockAIInterviewService.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {mockAIInterviewService.questions.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {formatTime(timer)} remaining
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          {cameraEnabled && (
            <div className="lg:col-span-1">
              <div className="card overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-gray-50 border-t">
                  <p className="text-xs text-gray-500 text-center">Live Preview</p>
                </div>
              </div>
            </div>
          )}

          {/* Question & Response */}
          <div className={`${cameraEnabled ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="card p-6">
              {/* AI Question */}
              <div className="mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">AI Interviewer</p>
                    <p className="text-lg text-gray-900 font-medium">{question.question}</p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Response Input */}
              {analyzing ? (
                <div className="flex items-center justify-center py-8">
                  <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                  <p className="text-gray-600">AI is analyzing your response...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="label flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      Your Response
                    </label>
                    <textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      className="input h-32 resize-none"
                      placeholder="Type your response here... (Or use voice input if microphone is enabled)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentResponse.split(' ').length} words
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setCurrentResponse('')}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                    <div className="space-x-3">
                      {currentQuestion > 0 && (
                        <button
                          onClick={() => setCurrentQuestion(prev => prev - 1)}
                          className="btn-secondary"
                        >
                          <ArrowLeftIcon className="h-4 w-4 mr-1 inline" />
                          Previous
                        </button>
                      )}
                      <button
                        onClick={handleNext}
                        disabled={!currentResponse.trim()}
                        className="btn-primary"
                      >
                        {currentQuestion === mockAIInterviewService.questions.length - 1 ? (
                          'Finish Interview'
                        ) : (
                          <>
                            Next Question
                            <ArrowRightIcon className="h-4 w-4 ml-1 inline" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Complete Screen with Report
  const renderComplete = () => (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Interview Complete!</h2>
          <p className="text-gray-600 mt-2">Here's your personalized feedback report</p>
        </div>

        {finalReport && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div>
                  <p className="text-4xl font-bold">{finalReport.overallScore}</p>
                  <p className="text-sm">/100</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900 mt-3">
                {finalReport.recommendation}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{finalReport.totalQuestions}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{finalReport.completedQuestions}</p>
                <p className="text-sm text-gray-600">Answered</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{finalReport.averageWordsPerAnswer}</p>
                <p className="text-sm text-gray-600">Avg Words</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{Math.round(finalReport.overallScore / 10)}/10</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {finalReport.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start text-sm text-green-800">
                      <ArrowRightIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2" />
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {finalReport.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start text-sm text-orange-800">
                      <ArrowRightIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Individual Responses */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Response Analysis</h3>
              <div className="space-y-3">
                {responses.map((resp, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">Q{idx + 1}: {resp.question.question.substring(0, 60)}...</p>
                      <span className={`text-sm font-semibold ${
                        resp.analysis.score >= 70 ? 'text-green-600' : 
                        resp.analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {resp.analysis.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Detected {resp.analysis.detectedPoints}/{resp.analysis.totalPoints} key points
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {resp.analysis.feedback.map((fb, fidx) => (
                        <span key={fidx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {fb}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/tests')}
                className="btn-secondary"
              >
                Back to Tests
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
                Practice Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {step === 'setup' && renderSetup()}
      {step === 'intro' && renderIntro()}
      {step === 'interview' && renderInterview()}
      {step === 'reviewing' && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generating your feedback report...</p>
          </div>
        </div>
      )}
      {step === 'complete' && renderComplete()}
    </div>
  );
};

export default AIInterview;
