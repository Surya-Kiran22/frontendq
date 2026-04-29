import React, { useState } from 'react';
import {
  PlayIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  LightBulbIcon,
  ArrowPathIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock Compiler Service
const mockCompilerService = {
  compile: async (code, language, testCases) => {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = [];
    let allPassed = true;
    
    testCases.forEach((testCase, index) => {
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      const executionTime = (Math.random() * 0.5).toFixed(3);
      
      if (!passed) allPassed = false;
      
      results.push({
        testCase: index + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: passed ? testCase.output : generateWrongOutput(testCase.output),
        passed,
        executionTime: `${executionTime}s`,
        memory: `${(Math.random() * 10 + 10).toFixed(1)}MB`
      });
    });
    
    return {
      success: true,
      allPassed,
      results,
      summary: {
        total: testCases.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        totalExecutionTime: results.reduce((sum, r) => sum + parseFloat(r.executionTime), 0).toFixed(3)
      }
    };
  }
};

const generateWrongOutput = (expected) => {
  // Generate a slightly wrong output for demo purposes
  if (!isNaN(expected)) {
    return (parseInt(expected) + Math.floor(Math.random() * 5) + 1).toString();
  }
  return expected + '_wrong';
};

const Compiler = () => {
  const [code, setCode] = useState(`// Write your solution here
function twoSum(nums, target) {
    // Your code here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test with sample input
const nums = [2, 7, 11, 15];
const target = 9;
// Example: twoSum(nums, target) returns [0, 1]`);

  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  
  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'c', name: 'C', icon: '🔧' }
  ];

  const problem = {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { input: '[2,7,11,15], 9', output: '[0,1]' },
      { input: '[3,2,4], 6', output: '[1,2]' },
      { input: '[3,3], 6', output: '[0,1]' },
      { input: '[1,2,3,4,5], 9', output: '[3,4]' }
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers.',
      'Try to use a hash map to store the complement of each number.',
      'For each number, check if its complement (target - current) exists in the map.'
    ]
  };

  const handleRun = async () => {
    setCompiling(true);
    setOutput('Compiling...\n');
    
    try {
      const result = await mockCompilerService.compile(code, language, problem.testCases);
      
      if (result.success) {
        setTestResults(result);
        
        let outputText = '📝 Test Results:\n';
        outputText += '='.repeat(50) + '\n\n';
        
        result.results.forEach((test, index) => {
          outputText += `Test Case ${test.testCase}: ${test.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
          outputText += `Input: ${test.input}\n`;
          outputText += `Expected: ${test.expectedOutput}\n`;
          outputText += `Actual: ${test.actualOutput}\n`;
          outputText += `Time: ${test.executionTime} | Memory: ${test.memory}\n\n`;
        });
        
        outputText += '='.repeat(50) + '\n';
        outputText += `Summary: ${result.summary.passed}/${result.summary.total} passed\n`;
        outputText += `Total Execution Time: ${result.summary.totalExecutionTime}s\n`;
        
        setOutput(outputText);
        
        if (result.allPassed) {
          toast.success('All test cases passed! 🎉');
        } else {
          toast.warning(`${result.summary.failed} test case(s) failed`);
        }
      }
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
      toast.error('Compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Solve this coding problem and run the test cases
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHints(!showHints)}
            className="btn-secondary flex items-center text-sm"
          >
            <LightBulbIcon className="h-4 w-4 mr-2" />
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left Panel - Problem */}
        <div className="card overflow-hidden flex flex-col min-h-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4 inline mr-1" />
              Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'testcases'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BeakerIcon className="h-4 w-4 inline mr-1" />
              Test Cases
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'description' ? (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
                </div>

                {problem.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 text-sm mb-2">Example {idx + 1}:</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Input:</span> {example.input}</p>
                      <p><span className="font-medium">Output:</span> {example.output}</p>
                      {example.explanation && (
                        <p><span className="font-medium">Explanation:</span> {example.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">Constraints:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>

                {showHints && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-semibold text-yellow-800 text-sm mb-2 flex items-center">
                      <LightBulbIcon className="h-4 w-4 mr-1" />
                      Hints:
                    </p>
                    <ul className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                      {problem.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  The following test cases will be used to validate your solution:
                </p>
                {problem.testCases.map((test, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-900 text-sm mb-2">Test Case {idx + 1}:</p>
                    <div className="space-y-1 text-sm font-mono">
                      <p className="text-gray-700">Input: nums = {test.input.split(',')[0].trim()}, target = {test.input.split(',')[1].trim()}</p>
                      <p className="text-green-700">Expected Output: {test.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="card overflow-hidden flex flex-col min-h-0">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <CodeBracketIcon className="h-5 w-5 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRun}
              disabled={compiling}
              className="btn-primary text-sm py-2 px-4 flex items-center"
            >
              {compiling ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-gray-900 text-gray-100"
              spellCheck={false}
              placeholder="Write your code here..."
            />

            {/* Output Console */}
            <div className="h-48 border-t border-gray-200 bg-gray-900">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs font-semibold text-gray-400 flex items-center">
                  <DocumentTextIcon className="h-3 w-3 mr-1" />
                  Console Output
                </span>
                {testResults && (
                  <span className={`text-xs font-semibold ${
                    testResults.allPassed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {testResults.summary.passed}/{testResults.summary.total} Test Cases Passed
                  </span>
                )}
              </div>
              <pre className="h-full p-3 font-mono text-xs text-gray-300 overflow-y-auto pb-12">
                {output || '// Click "Run Code" to see output'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
