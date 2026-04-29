import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MicrophoneIcon, 
  StopIcon, 
  PlayIcon, 
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AIInterviewer = ({ question, onAnswerSubmit, resumeData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewHistory, setInterviewHistory] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const generateAIQuestion = useCallback(async () => {
    setIsProcessing(true);
    try {
      // API call to AI service (mock)
      // const response = await fetch('/api/ai/generate-question', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     resume: resumeData,
      //     questionType: question.type || 'technical',
      //     previousAnswers: interviewHistory
      //   })
      // });

      // const data = await response.json();
      // setAiResponse(data.question);
      
      // Mock question for demo
      setAiResponse('Tell me about your experience with ' + (resumeData?.skills?.[0] || 'programming'));
      
      // Convert text to speech
      await speakText(setAiResponse);
    } catch (error) {
      setAiResponse('Tell me about your experience with ' + (resumeData?.skills?.[0] || 'programming'));
    } finally {
      setIsProcessing(false);
    }
  }, [resumeData, question, interviewHistory]);

  useEffect(() => {
    // Initialize with AI-generated question based on resume
    if (resumeData && question) {
      generateAIQuestion();
    }
  }, [resumeData, question, generateAIQuestion]);

  const speakText = async (text) => {
    try {
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Speech synthesis not supported
      }
    } catch (error) {
      // Error in speech synthesis
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Transcribe audio
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast.success('Recording stopped');
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // API call to speech-to-text service (mock)
      // const formData = new FormData();
      // formData.append('audio', audioBlob, 'interview.wav');

      // const response = await fetch('/api/ai/transcribe', {
      //   method: 'POST',
      //   body: formData
      // });

      // const data = await response.json();
      // setTranscript(data.transcript);

      // Mock transcript for demo
      setTranscript('This is a mock transcript of the interview answer.');

      // Evaluate the answer
      await evaluateAnswer(setTranscript);
    } catch (error) {
      setTranscript('Transcription failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const evaluateAnswer = async (answerText) => {
    setIsProcessing(true);
    try {
      // API call to AI evaluation service (mock)
      // const response = await fetch('/api/ai/evaluate-answer', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     question: aiResponse,
      //     answer: answerText,
      //     resume: resumeData,
      //     context: interviewHistory
      //   })
      // });

      // const evaluation = await response.json();
      
      // Mock evaluation for demo
      const evaluation = { score: 85, feedback: 'Good answer, covers key points' };
      
      // Add to interview history
      const newEntry = {
        question: aiResponse,
        answer: answerText,
        evaluation: evaluation,
        timestamp: new Date()
      };
      
      setInterviewHistory(prev => [...prev, newEntry]);
      
      // Submit answer to parent
      onAnswerSubmit(question._id, {
        transcript: answerText,
        audioUrl: audioUrl,
        evaluation: evaluation
      });
      
      // Generate follow-up question
      if (currentQuestion < 4) { // Limit to 5 questions
        setCurrentQuestion(prev => prev + 1);
        setTimeout(() => generateAIQuestion(), 2000);
      }
    } catch (error) {
      // Error evaluating answer
    } finally {
      setIsProcessing(false);
    }
  };

  const replayQuestion = () => {
    if (aiResponse) {
      speakText(aiResponse);
    }
  };

  const skipQuestion = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(prev => prev + 1);
      generateAIQuestion();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Interviewer</h3>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of 5
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {aiResponse && (
              <button
                onClick={replayQuestion}
                disabled={isPlaying}
                className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50"
                title="Replay Question"
              >
                <SpeakerWaveIcon className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={skipQuestion}
              disabled={isProcessing || isRecording}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Question */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CpuChipIcon className="h-6 w-6 text-primary-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Interviewer:</h4>
              <p className="text-gray-700">
                {isProcessing && currentQuestion === 0 ? 
                  'Generating personalized question...' : 
                  aiResponse || 'Loading question...'
                }
              </p>
              
              {isPlaying && (
                <div className="mt-2 flex items-center text-sm text-primary-600">
                  <SpeakerWaveIcon className="h-4 w-4 mr-1 animate-pulse" />
                  Speaking...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recording Interface */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Your Response</h4>
            <div className="flex items-center space-x-2">
              {isRecording && (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                  Recording...
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
                  Processing...
                </div>
              )}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MicrophoneIcon className="h-5 w-5 mr-2" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <StopIcon className="h-5 w-5 mr-2" />
                Stop Recording
              </button>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">Transcript</h5>
                <span className="text-sm text-gray-500">
                  {transcript.length} characters
                </span>
              </div>
              <p className="text-gray-700">{transcript}</p>
            </div>
          )}

          {/* Audio Playback */}
          {audioUrl && (
            <div className="mt-4">
              <audio ref={audioRef} controls className="w-full">
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {/* Interview History */}
        {interviewHistory.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Interview History</h4>
            <div className="space-y-4">
              {interviewHistory.map((entry, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {/* Question */}
                    <div className="flex items-start space-x-2">
                      <CpuChipIcon className="h-5 w-5 text-primary-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{entry.question}</p>
                      </div>
                    </div>
                    
                    {/* Answer */}
                    <div className="flex items-start space-x-2">
                      <UserCircleIcon className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{entry.answer}</p>
                      </div>
                    </div>
                    
                    {/* Evaluation */}
                    {entry.evaluation && (
                      <div className="ml-7 p-3 bg-white rounded border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Clarity:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${entry.evaluation.clarity || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-gray-700">
                                {entry.evaluation.clarity || 0}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Relevance:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${entry.evaluation.relevance || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-gray-700">
                                {entry.evaluation.relevance || 0}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${entry.evaluation.confidence || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-gray-700">
                                {entry.evaluation.confidence || 0}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Technical:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: `${entry.evaluation.technical || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-gray-700">
                                {entry.evaluation.technical || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {entry.evaluation.feedback && (
                          <div className="mt-3 text-sm text-gray-600">
                            <strong>Feedback:</strong> {entry.evaluation.feedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Interview Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Structure your answers with examples</li>
            <li>• Be specific about your experience</li>
            <li>• Ask for clarification if needed</li>
            <li>• Maintain eye contact with the camera</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;
