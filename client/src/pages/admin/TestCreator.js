import React, { useState, useEffect } from 'react';
import { mockCompanyService } from '../../services/mockData';
import {
  PlusIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TestCreator = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [testConfig, setTestConfig] = useState(null);
  const [activeRound, setActiveRound] = useState(null);
  const [activeQuestionSet, setActiveQuestionSet] = useState(1);
  const [loading, setLoading] = useState(true);

  const questionSets = [
    { id: 1, name: 'Set A', color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Set B', color: 'bg-green-100 text-green-800' },
    { id: 3, name: 'Set C', color: 'bg-purple-100 text-purple-800' }
  ];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateQuestionSets = (roundId) => {
    const roundConfig = testConfig.rounds[roundId];
    const pool = roundConfig.questions || [];
    
    if (pool.length === 0) {
      toast.error('Please add questions to the pool first');
      return;
    }

    const shuffled = shuffleArray(pool);
    const setSize = Math.ceil(shuffled.length / 3);
    const set1 = shuffled.slice(0, setSize);
    const set2 = shuffled.slice(setSize, setSize * 2);
    const set3 = shuffled.slice(setSize * 2);

    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          questionSets: {
            1: set1,
            2: set2,
            3: set3
          }
        }
      }
    }));

    toast.success(`Generated 3 question sets from ${pool.length} questions`);
  };

  const rounds = [
    { id: 'aptitude', name: 'Aptitude Round', icon: '📝', description: 'MCQ-based aptitude test' },
    { id: 'coding', name: 'Coding Round', icon: '💻', description: 'Programming assessment' },
    { id: 'communication', name: 'Communication Round', icon: '🎤', description: 'Speaking and listening test' },
    { id: 'interview', name: 'Interview Round', icon: '👔', description: 'Resume-based interview' },
    { id: 'hr', name: 'HR Round', icon: '🤝', description: 'AI-powered HR interview' }
  ];

  const codingLanguages = ['C', 'Java', 'Python', 'SQL'];
  const communicationTypes = ['Passage Reading', 'Audio Listening', 'Sentence Repeating', 'Speaking'];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const companiesData = await mockCompanyService.getAllCompanies();
      setCompanies(companiesData);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    const createRoundConfig = () => ({
      enabled: true,
      duration: 30,
      questionCount: 30,
      questions: [],
      questionSets: {
        1: [],
        2: [],
        3: []
      }
    });

    const existingConfig = {
      companyId: company._id,
      companyName: company.name,
      rounds: {
        aptitude: createRoundConfig(),
        coding: { ...createRoundConfig(), duration: 60, questionCount: 5, languages: ['Python', 'Java'] },
        communication: { ...createRoundConfig(), duration: 20, questionCount: 10, types: ['Passage Reading', 'Audio Listening'] },
        interview: { ...createRoundConfig(), duration: 30, questionCount: 5, basedOnResume: true },
        hr: { ...createRoundConfig(), duration: 20, questionCount: 5, aiPowered: true }
      }
    };
    setTestConfig(existingConfig);
    setActiveQuestionSet(1);
  };

  const handleRoundToggle = (roundId) => {
    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          enabled: !prev.rounds[roundId].enabled
        }
      }
    }));
  };

  const handleRoundConfig = (roundId, field, value) => {
    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          [field]: value
        }
      }
    }));
  };

  const handleAddQuestion = (roundId) => {
    let newQuestion = {};

    if (roundId === 'aptitude') {
      newQuestion = {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1
      };
    } else if (roundId === 'coding') {
      newQuestion = {
        id: Date.now(),
        title: '',
        description: '',
        language: 'Python',
        starterCode: '',
        testCases: [],
        marks: 10
      };
    } else if (roundId === 'communication') {
      newQuestion = {
        id: Date.now(),
        type: 'Passage Reading',
        content: '',
        question: '',
        marks: 5
      };
    } else if (roundId === 'interview' || roundId === 'hr') {
      newQuestion = {
        id: Date.now(),
        question: '',
        type: roundId === 'hr' ? 'behavioral' : 'technical',
        marks: 10
      };
    }

    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          questions: [...prev.rounds[roundId].questions, newQuestion]
        }
      }
    }));
    
    toast.success('Question added to pool. Click "Generate Question Sets" to distribute to 3 sets.');
  };

  const handleRemoveQuestionFromPool = (roundId, questionId) => {
    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          questions: prev.rounds[roundId].questions.filter(q => q.id !== questionId)
        }
      }
    }));
  };

  const handleUpdateQuestionInPool = (roundId, questionId, field, value) => {
    setTestConfig(prev => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [roundId]: {
          ...prev.rounds[roundId],
          questions: prev.rounds[roundId].questions.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
          )
        }
      }
    }));
  };

  const handleSaveTest = () => {
    toast.success('Test configuration saved successfully');
  };

  const exportToExcel = () => {
    const exportData = [];
    
    Object.entries(testConfig.rounds).forEach(([roundId, round]) => {
      if (round.enabled) {
        [1, 2, 3].forEach(setNum => {
          const questions = round.questionSets?.[setNum] || [];
          if (questions.length > 0) {
            questions.forEach((q, idx) => {
              exportData.push({
                Round: roundId,
                Question_Set: `Set ${String.fromCharCode(64 + setNum)}`,
                Question_Number: idx + 1,
                Question: q.question || q.title || q.content,
                Type: q.type || 'N/A',
                Marks: q.marks
              });
            });
          }
        });
      }
    });

    if (exportData.length === 0) {
      toast.error('No questions to export');
      return;
    }

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${testConfig.companyName}_test_questions.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Test questions exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Test Creator</h1>
        <p className="mt-2 text-gray-600">Create and manage company-specific test configurations</p>
      </div>

      {!selectedCompany ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Select Company</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <button
                  key={company._id}
                  onClick={() => handleCompanySelect(company)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-primary-600">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h2>
                  <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 btn-outline"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Export Questions
                </button>
                <button
                  onClick={handleSaveTest}
                  className="btn-primary"
                >
                  Save Test Configuration
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {rounds.map((round) => {
              const roundConfig = testConfig.rounds[round.id];
              return (
                <div key={round.id} className="bg-white rounded-lg shadow">
                  <div
                    className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setActiveRound(activeRound === round.id ? null : round.id)}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{round.icon}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{round.name}</h3>
                        <p className="text-sm text-gray-500">{round.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={roundConfig.enabled}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRoundToggle(round.id);
                          }}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm text-gray-600">Enabled</span>
                      </label>
                      {activeRound === round.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {activeRound === round.id && roundConfig.enabled && (
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="label">Duration (minutes)</label>
                          <input
                            type="number"
                            className="input"
                            value={roundConfig.duration}
                            onChange={(e) => handleRoundConfig(round.id, 'duration', parseInt(e.target.value))}
                            min="5"
                          />
                        </div>
                        <div>
                          <label className="label">Number of Questions</label>
                          <input
                            type="number"
                            className="input"
                            value={roundConfig.questionCount}
                            onChange={(e) => handleRoundConfig(round.id, 'questionCount', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                        {round.id === 'coding' && (
                          <div>
                            <label className="label">Languages</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {codingLanguages.map((lang) => (
                                <label key={lang} className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={roundConfig.languages?.includes(lang)}
                                    onChange={(e) => {
                                      const newLangs = e.target.checked
                                        ? [...(roundConfig.languages || []), lang]
                                        : roundConfig.languages.filter(l => l !== lang);
                                      handleRoundConfig(round.id, 'languages', newLangs);
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">{lang}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        {round.id === 'communication' && (
                          <div>
                            <label className="label">Communication Types</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {communicationTypes.map((type) => (
                                <label key={type} className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={roundConfig.types?.includes(type)}
                                    onChange={(e) => {
                                      const newTypes = e.target.checked
                                        ? [...(roundConfig.types || []), type]
                                        : roundConfig.types.filter(t => t !== type);
                                      handleRoundConfig(round.id, 'types', newTypes);
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        {(round.id === 'interview' || round.id === 'hr') && (
                          <div>
                            <label className="label">
                              {round.id === 'hr' ? 'AI-Powered' : 'Based on Resume'}
                            </label>
                            <input
                              type="checkbox"
                              checked={round.id === 'hr' ? roundConfig.aiPowered : roundConfig.basedOnResume}
                              onChange={(e) => {
                                const field = round.id === 'hr' ? 'aiPowered' : 'basedOnResume';
                                handleRoundConfig(round.id, field, e.target.checked);
                              }}
                              className="w-4 h-4 mt-2"
                            />
                          </div>
                        )}
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            Question Pool ({roundConfig.questions?.length || 0} questions)
                          </h4>
                          <button
                            onClick={() => handleAddQuestion(round.id)}
                            className="flex items-center gap-2 btn-primary text-sm"
                          >
                            <PlusIcon className="h-4 w-4" />
                            Add to Pool
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Add all questions here first, then generate sets for distribution.
                        </p>
                        {(roundConfig.questions?.length || 0) > 0 && (
                          <button
                            onClick={() => generateQuestionSets(round.id)}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                            Generate Question Sets (A, B, C)
                          </button>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <label className="label mb-2">View Generated Question Sets</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveQuestionSet(0)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activeQuestionSet === 0
                                ? 'bg-gray-800 text-white ring-2 ring-offset-2 ring-gray-500'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            Pool ({roundConfig.questions?.length || 0})
                          </button>
                          {questionSets.map((set) => (
                            <button
                              key={set.id}
                              onClick={() => setActiveQuestionSet(set.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeQuestionSet === set.id
                                  ? set.color + ' ring-2 ring-offset-2 ring-primary-500'
                                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {set.name} ({roundConfig.questionSets?.[set.id]?.length || 0})
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Students will be randomly assigned one of Set A, B, or C to prevent cheating
                        </p>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-4">
                          {activeQuestionSet === 0 ? 'Question Pool' : questionSets.find(s => s.id === activeQuestionSet)?.name}
                          {' '}({activeQuestionSet === 0 
                            ? (roundConfig.questions?.length || 0) 
                            : (roundConfig.questionSets?.[activeQuestionSet]?.length || 0)
                          } questions)
                        </h4>

                        {activeQuestionSet === 0 ? (
                          (roundConfig.questions?.length || 0) === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No questions in pool. Click "Add to Pool" to add questions.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {roundConfig.questions?.map((question, idx) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-500">Question {idx + 1}</span>
                                      {round.id === 'aptitude' && (
                                        <input
                                          type="text"
                                          className="input mt-2"
                                          placeholder="Enter question"
                                          value={question.question}
                                          onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'question', e.target.value)}
                                        />
                                      )}
                                      {round.id === 'coding' && (
                                        <>
                                          <input
                                            type="text"
                                            className="input mt-2"
                                            placeholder="Problem title"
                                            value={question.title}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'title', e.target.value)}
                                          />
                                          <textarea
                                            className="input mt-2"
                                            rows="3"
                                            placeholder="Problem description"
                                            value={question.description}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'description', e.target.value)}
                                          />
                                          <select
                                            className="input mt-2"
                                            value={question.language}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'language', e.target.value)}
                                          >
                                            {codingLanguages.map(lang => (
                                              <option key={lang} value={lang}>{lang}</option>
                                            ))}
                                          </select>
                                        </>
                                      )}
                                      {round.id === 'communication' && (
                                        <>
                                          <select
                                            className="input mt-2"
                                            value={question.type}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'type', e.target.value)}
                                          >
                                            {communicationTypes.map(type => (
                                              <option key={type} value={type}>{type}</option>
                                            ))}
                                          </select>
                                          <textarea
                                            className="input mt-2"
                                            rows="2"
                                            placeholder="Content (passage/audio text)"
                                            value={question.content}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'content', e.target.value)}
                                          />
                                          <input
                                            type="text"
                                            className="input mt-2"
                                            placeholder="Question"
                                            value={question.question}
                                            onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'question', e.target.value)}
                                          />
                                        </>
                                      )}
                                      {(round.id === 'interview' || round.id === 'hr') && (
                                        <textarea
                                          className="input mt-2"
                                          rows="2"
                                          placeholder="Interview question"
                                          value={question.question}
                                          onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'question', e.target.value)}
                                        />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <input
                                        type="number"
                                        className="input w-20 text-sm"
                                        placeholder="Marks"
                                        value={question.marks}
                                        onChange={(e) => handleUpdateQuestionInPool(round.id, question.id, 'marks', parseInt(e.target.value))}
                                        min="1"
                                      />
                                      <button
                                        onClick={() => handleRemoveQuestionFromPool(round.id, question.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                    {round.id === 'aptitude' && (
                                      <div className="mt-3 space-y-2">
                                        <label className="text-sm text-gray-600">Options:</label>
                                        {question.options.map((opt, optIdx) => (
                                          <div key={optIdx} className="flex items-center gap-2">
                                            <input
                                              type="radio"
                                              name={`correct-${question.id}`}
                                              checked={question.correctAnswer === optIdx}
                                              onChange={() => handleUpdateQuestionInPool(round.id, question.id, 'correctAnswer', optIdx)}
                                              className="w-4 h-4"
                                            />
                                            <input
                                              type="text"
                                              className="input flex-1 text-sm"
                                              placeholder={`Option ${optIdx + 1}`}
                                              value={opt}
                                              onChange={(e) => {
                                                const newOptions = [...question.options];
                                                newOptions[optIdx] = e.target.value;
                                                handleUpdateQuestionInPool(round.id, question.id, 'options', newOptions);
                                              }}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          (roundConfig.questionSets?.[activeQuestionSet]?.length || 0) === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No questions in this set. Generate sets from the pool first.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {roundConfig.questionSets?.[activeQuestionSet]?.map((question, idx) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-500">Question {idx + 1}</span>
                                      {round.id === 'aptitude' && (
                                        <p className="mt-2 text-sm font-medium">{question.question}</p>
                                      )}
                                      {round.id === 'coding' && (
                                        <>
                                          <p className="mt-2 text-sm font-bold">{question.title}</p>
                                          <p className="mt-1 text-sm text-gray-600">{question.description}</p>
                                          <p className="mt-1 text-xs text-gray-500">Language: {question.language}</p>
                                        </>
                                      )}
                                      {round.id === 'communication' && (
                                        <>
                                          <p className="mt-2 text-xs text-gray-500">Type: {question.type}</p>
                                          <p className="mt-1 text-sm text-gray-600">{question.content}</p>
                                          <p className="mt-1 text-sm font-medium">{question.question}</p>
                                        </>
                                      )}
                                      {(round.id === 'interview' || round.id === 'hr') && (
                                        <p className="mt-2 text-sm font-medium">{question.question}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <span className="text-sm font-bold text-gray-700">{question.marks} marks</span>
                                    </div>
                                    {round.id === 'aptitude' && question.options && (
                                      <div className="mt-3 space-y-2">
                                        <label className="text-sm text-gray-600">Options:</label>
                                        {question.options.map((opt, optIdx) => (
                                          <div key={optIdx} className="flex items-center gap-2">
                                            <span className={`text-sm ${question.correctAnswer === optIdx ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                                              {optIdx === question.correctAnswer ? '✓' : ''} {opt}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default TestCreator;

