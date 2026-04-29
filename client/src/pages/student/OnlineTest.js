import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTestService } from '../../services/mockData';
import {
  ClockIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OnlineTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proctoringEnabled, setProctoringEnabled] = useState(false);
  const [violations, setViolations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [examSuspended, setExamSuspended] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [requireFullscreenToContinue, setRequireFullscreenToContinue] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [systemTestStep, setSystemTestStep] = useState('check'); // check, webcam, microphone, ready
  const [webcamWorking, setWebcamWorking] = useState(false);
  const [microphoneWorking, setMicrophoneWorking] = useState(false);
  const [assignedQuestionSet, setAssignedQuestionSet] = useState(null);
  
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const timerRef = useRef(null);
  const proctoringIntervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const handleContextMenuRef = useRef(null);
  const handleCopyRef = useRef(null);
  const handlePasteRef = useRef(null);

  const checkDeviceType = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth < 768;
    
    if (isMobile || isSmallScreen) {
      setIsMobileDevice(true);
    }
  }, []);

  const testWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamWorking(true);
      setSystemTestStep('microphone');
    } catch (error) {
      setWebcamWorking(false);
      toast.error('Webcam not accessible. Please check permissions.');
    }
  }, []);

  const testMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setMicrophoneWorking(true);
      stream.getTracks().forEach(track => track.stop());
      setSystemTestStep('ready');
      toast.success('System test completed successfully!');
    } catch (error) {
      setMicrophoneWorking(false);
      toast.error('Microphone not accessible. Please check permissions.');
    }
  }, []);

  const startExam = useCallback(() => {
    if (webcamWorking && microphoneWorking) {
      // Randomly assign question set (1, 2, or 3) to prevent cheating
      const randomSet = Math.floor(Math.random() * 3) + 1;
      setAssignedQuestionSet(randomSet);
      setSystemTestStep('ready');
      toast.success(`You have been assigned Question Set ${String.fromCharCode(64 + randomSet)}`);
    }
  }, [webcamWorking, microphoneWorking]);

  const cleanupStreams = useCallback(() => {
    // Stop media recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
  }, [webcamStream, screenStream]);

  const fetchTestDetails = useCallback(async () => {
    try {
      const testData = await mockTestService.getTestById(testId);
      
      const testWithQuestions = {
        ...testData,
        questions: [
          {
            id: 1,
            question: 'What is the output of 2 + 2?',
            type: 'multiple-choice',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'Which of the following is a programming language?',
            type: 'multiple-choice',
            options: ['HTML', 'CSS', 'JavaScript', 'All of the above'],
            correctAnswer: 3
          },
          {
            id: 3,
            question: 'What does API stand for?',
            type: 'multiple-choice',
            options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Program Instruction'],
            correctAnswer: 0
          }
        ],
        proctoring: testData.proctoring || { enableFullscreen: false, enableWebcam: false }
      };
      
      setTest(testWithQuestions);
      setTimeLeft(testData.duration * 60);
      setProctoringEnabled(testData.proctoring?.enableWebcam || false);
      
      // Get random question set from test data or default to set 1
      const availableSets = testData.rounds?.aptitude?.questionSets || { 1: [], 2: [], 3: [] };
      const randomSet = Math.floor(Math.random() * 3) + 1;
      const selectedQuestions = availableSets[randomSet] || availableSets[1] || [];
      
      setAssignedQuestionSet(randomSet);
      
      setAttempt({
        _id: 'mock-attempt-' + Date.now(),
        status: 'in-progress',
        startedAt: new Date().toISOString(),
        questionSet: randomSet
      });
    } catch (error) {
      toast.error('Failed to load test');
      navigate('/tests');
    } finally {
      setIsLoading(false);
    }
  }, [testId, navigate]);

  useEffect(() => {
    checkDeviceType();
    fetchTestDetails();
    return () => {
      cleanupStreams();
      if (timerRef.current) clearInterval(timerRef.current);
      if (proctoringIntervalRef.current) clearInterval(proctoringIntervalRef.current);
    };
  }, [checkDeviceType, fetchTestDetails, cleanupStreams]);

  const initializeProctoring = async (proctoringConfig) => {
    try {
      setProctoringEnabled(true);
      
      // Initialize webcam with audio
      if (proctoringConfig.enableWebcam) {
        const webcamStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setWebcamStream(webcamStream);
        if (videoRef.current) {
          videoRef.current.srcObject = webcamStream;
        }
        
        // Start recording webcam with roll number prefix
        recordedChunksRef.current = [];
        mediaRecorderRef.current = new MediaRecorder(webcamStream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const rollNumber = attempt?.studentRollNumber || 'unknown';
          const fileName = `${rollNumber}_webcam_${testId}_${Date.now()}.webm`;
          
          // In a real app, this would upload to a server
          console.log(`Recording saved as: ${fileName}`, blob);
          
          // Reset chunks
          recordedChunksRef.current = [];
        };
        
        mediaRecorderRef.current.start();
      }
      
      // Initialize screen recording with audio
      if (proctoringConfig.enableScreenRecording) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenStream(screenStream);
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
        }
        
        // Start recording screen with roll number prefix
        const screenRecorder = new MediaRecorder(screenStream);
        const screenChunks = [];
        
        screenRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            screenChunks.push(event.data);
          }
        };
        
        screenRecorder.onstop = () => {
          const blob = new Blob(screenChunks, { type: 'video/webm' });
          const rollNumber = attempt?.studentRollNumber || 'unknown';
          const fileName = `${rollNumber}_screen_${testId}_${Date.now()}.webm`;
          
          // In a real app, this would upload to a server
          console.log(`Screen recording saved as: ${fileName}`, blob);
        };
        
        screenRecorder.start();
        
        // Handle screen recording end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          screenRecorder.stop();
          handleViolation('screen-recording-ended', 'Screen recording was stopped');
        });
      }
      
      // Start proctoring monitoring
      if (proctoringConfig.enableTabSwitchDetection) {
        startTabSwitchDetection();
      }
      
      // Start periodic proctoring data collection
      proctoringIntervalRef.current = setInterval(() => {
        collectProctoringData();
      }, 30000); // Every 30 seconds
      
    } catch (error) {
      handleViolation('proctoring-failed', 'Failed to initialize proctoring features');
    }
  };

  const startTabSwitchDetection = () => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          
          // Log violation
          handleViolation('tab-switch', `Tab switched ${newCount} times`);
          
          // Suspend exam after 2 tab switches
          if (newCount >= 2) {
            setExamSuspended(true);
            toast.error('Exam suspended due to multiple tab switches');
          } else {
            // Require fullscreen to continue after first tab switch
            setRequireFullscreenToContinue(true);
            toast.error('Tab switch detected! Please return to fullscreen to continue.');
          }
          
          return newCount;
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent right-click
    if (test?.proctoring?.allowRightClick === false) {
      handleContextMenuRef.current = (e) => {
        e.preventDefault();
        handleViolation('right-click', 'Right-click attempted');
        return false;
      };
      document.addEventListener('contextmenu', handleContextMenuRef.current);
    }
    
    // Prevent copy-paste
    if (test?.proctoring?.allowCopyPaste === false) {
      handleCopyRef.current = (e) => {
        e.preventDefault();
        handleViolation('copy-paste', 'Copy attempt blocked');
        return false;
      };
      document.addEventListener('copy', handleCopyRef.current);
      
      handlePasteRef.current = (e) => {
        e.preventDefault();
        handleViolation('copy-paste', 'Paste attempt blocked');
        return false;
      };
      document.addEventListener('paste', handlePasteRef.current);
    }

    // Return cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (test?.proctoring?.allowRightClick === false && handleContextMenuRef.current) {
        document.removeEventListener('contextmenu', handleContextMenuRef.current);
        handleContextMenuRef.current = null;
      }
      if (test?.proctoring?.allowCopyPaste === false) {
        if (handleCopyRef.current) {
          document.removeEventListener('copy', handleCopyRef.current);
          handleCopyRef.current = null;
        }
        if (handlePasteRef.current) {
          document.removeEventListener('paste', handlePasteRef.current);
          handlePasteRef.current = null;
        }
      }
    };
  };

  const collectProctoringData = async () => {
    if (!proctoringEnabled || !attempt) return;
    
    try {
      // Capture webcam image
      if (webcamStream && videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('webcamImage', blob, 'webcam.jpg');
          
          // Webcam capture for proctoring
        }, 'image/jpeg');
      }
      
      // Capture screen
      if (screenStream && screenRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = screenRef.current.videoWidth;
        canvas.height = screenRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(screenRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          // Screen capture for proctoring
        }, 'image/jpeg');
      }
    } catch (error) {
      // Error collecting proctoring data
    }
  };

  const handleViolation = (type, details) => {
    const violation = {
      type,
      details,
      timestamp: new Date()
    };
    
    setViolations(prev => {
      const newViolations = [...prev, violation];
      
      // Show warning for serious violations
      if (type === 'tab-switch' && newViolations.filter(v => v.type === 'tab-switch').length > 2) {
        toast.error('Warning: Multiple tab switches detected!');
      }
      
      return newViolations;
    });
    
    // Violation logged to backend
  };

  const requestFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setRequireFullscreenToContinue(false);
      
      // Handle fullscreen exit
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
    } catch (error) {
      handleViolation('fullscreen-failed', 'Failed to enter fullscreen mode');
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      setIsFullscreen(false);
      setRequireFullscreenToContinue(true);
      handleViolation('fullscreen-exit', 'Fullscreen mode was exited');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Answer saved to backend
  };

  const handleCodeChange = (questionId, code, language) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { code, language }
    }));
    
    // Code saved to backend
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock test submission and calculate results
      const totalQuestions = test.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      let correctAnswers = 0;
      
      test.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer || answers[q.id]?.toString() === q.correctAnswer?.toString()) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= 60;
      
      const mockResults = {
        score,
        passed,
        totalQuestions,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers - (totalQuestions - answeredQuestions),
        unanswered: totalQuestions - answeredQuestions,
        timeSpent: test.duration * 60 - timeLeft,
        percentile: Math.floor(Math.random() * 30) + 60
      };
      
      setResults(mockResults);
      setShowResults(true);
      
      cleanupStreams();
      
      toast.success(`Test submitted! Score: ${score}%`);
      
      // Navigate to test results page after delay
      setTimeout(() => {
        navigate(`/test-results/${testId}`);
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, test, answers, timeLeft, testId, navigate, cleanupStreams]);

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isMobileDevice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Device Not Supported</h2>
          <p className="text-gray-600 mb-6">
            This exam can only be taken on a laptop or desktop computer. Mobile devices and tablets are not supported due to proctoring requirements.
          </p>
          <button
            onClick={() => navigate('/tests')}
            className="btn-primary"
          >
            Return to Tests
          </button>
        </div>
      </div>
    );
  }

  if (systemTestStep !== 'ready') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <VideoCameraIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">System Test</h2>
            <p className="text-gray-600">
              Please verify your webcam and microphone are working before starting the exam.
            </p>
          </div>

          <div className="space-y-6">
            {/* Webcam Test */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Webcam Test</h3>
                {webcamWorking ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-48 object-cover"
                />
              </div>
              <button
                onClick={testWebcam}
                disabled={webcamWorking}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  webcamWorking
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {webcamWorking ? 'Webcam Working' : 'Test Webcam'}
              </button>
            </div>

            {/* Microphone Test */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Microphone Test</h3>
                {microphoneWorking ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 mb-4">
                Click the button below to test your microphone. You will be prompted to allow microphone access.
              </p>
              <button
                onClick={testMicrophone}
                disabled={microphoneWorking}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  microphoneWorking
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {microphoneWorking ? 'Microphone Working' : 'Test Microphone'}
              </button>
            </div>

            {/* Start Exam Button */}
            <button
              onClick={startExam}
              disabled={!webcamWorking || !microphoneWorking}
              className={`w-full py-3 px-4 rounded-lg font-medium text-lg ${
                webcamWorking && microphoneWorking
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (examSuspended) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Suspended</h2>
          <p className="text-gray-600 mb-6">
            Your exam has been suspended due to multiple tab switches. This violates the exam proctoring rules.
          </p>
          <button
            onClick={() => navigate('/tests')}
            className="btn-primary"
          >
            Return to Tests
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h2>
          <div className="space-y-4 mb-6">
            <div className="text-4xl font-bold text-primary-600">{results.score}%</div>
            <p className="text-gray-600">
              {results.passed ? 'Congratulations! You passed the test.' : 'You did not pass. Keep practicing!'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-900">Correct</div>
                <div className="text-green-600">{results.correctAnswers}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-900">Wrong</div>
                <div className="text-red-600">{results.wrongAnswers}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-900">Unanswered</div>
                <div className="text-gray-600">{results.unanswered}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-900">Percentile</div>
                <div className="text-primary-600">{results.percentile}%</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/tests')}
            className="btn-primary"
          >
            Return to Tests
          </button>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Fullscreen Required Overlay */}
      {requireFullscreenToContinue && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-slate-100">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Fullscreen Required</h2>
            <p className="text-slate-600 mb-6">
              You exited fullscreen mode. Please re-enter fullscreen to continue the exam.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{test.title}</h1>
              <span className="text-sm font-medium text-slate-500">
                Question {currentQuestion + 1} of {test.questions.length}
              </span>
              {assignedQuestionSet && (
                <span className="ml-3 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200">
                  Set {String.fromCharCode(64 + assignedQuestionSet)}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                timeLeft < 300 ? 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                <ClockIcon className="h-4 w-4" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
              
              {/* Violations warning */}
              {violations.length > 0 && (
                <div className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-xl border border-amber-200">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span className="text-xs font-bold">{violations.length}</span>
                </div>
              )}
              
              {/* Fullscreen indicator */}
              {test?.proctoring?.enableFullscreen && (
                <div className={`flex items-center space-x-1 px-3 py-2 rounded-xl ${
                  isFullscreen ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200' : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-200'
                }`}>
                  <ComputerDesktopIcon className="h-4 w-4" />
                  <span className="text-xs font-bold">
                    {isFullscreen ? 'Fullscreen' : 'Exit Fullscreen'}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 h-1.5 rounded-full transition-all duration-300 shadow-lg shadow-indigo-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {question.question}
                </h2>
                
                {/* Question metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {question.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {question.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded">
                    {question.points} points
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-6">
                {question.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option.option}
                          checked={answers[question._id] === option.option}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="mt-1 mr-3"
                        />
                        <span className="text-gray-700">{option.option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="space-y-3">
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={answers[question._id] === option}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'coding' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Programming Language
                      </label>
                      <select
                        value={answers[question._id]?.language || 'python'}
                        onChange={(e) => handleCodeChange(question._id, '', e.target.value)}
                        className="input"
                      >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Solution
                      </label>
                      <textarea
                        value={answers[question._id]?.code || ''}
                        onChange={(e) => handleCodeChange(question._id, e.target.value, answers[question._id]?.language || 'python')}
                        className="input font-mono text-sm"
                        rows={12}
                        placeholder="Write your code here..."
                      />
                    </div>
                  </div>
                )}

                {question.type === 'fill-blank' && (
                  <input
                    type="text"
                    value={answers[question._id] || ''}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    className="input"
                    placeholder="Enter your answer..."
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="btn-secondary flex items-center"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestion === test.questions.length - 1}
                  className="btn-secondary flex items-center"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Question Navigator */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      index === currentQuestion
                        ? 'bg-primary-600 text-white'
                        : answers[test.questions[index]._id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Proctoring Status */}
            {proctoringEnabled && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Proctoring Status</h3>
                
                {test?.proctoring?.enableWebcam && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Webcam</span>
                      {webcamStream ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-24 bg-black rounded object-cover"
                    />
                  </div>
                )}
                
                {test?.proctoring?.enableScreenRecording && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Screen</span>
                      {screenStream ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <video
                      ref={screenRef}
                      autoPlay
                      muted
                      className="w-full h-24 bg-black rounded object-cover"
                    />
                  </div>
                )}
                
                {violations.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded">
                    <p className="text-xs text-yellow-800">
                      {violations.length} violation(s) detected
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Read each question carefully</p>
                <p>• Manage your time wisely</p>
                {test?.proctoring?.enableFullscreen && (
                  <p>• Stay in fullscreen mode</p>
                )}
                {test?.proctoring?.enableTabSwitchDetection && (
                  <p>• Do not switch tabs</p>
                )}
                <p>• Submit before time expires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineTest;
