import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, CheckCircleIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const CodingEditor = ({ question, onCodeChange, initialCode = '', language = 'python' }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize code editor (you can integrate CodeMirror, Monaco, or other editors)
      editorRef.current.value = code;
    }
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    onCodeChange(question._id, newCode, language);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Get custom input if provided
      const customInput = document.getElementById('custom-input')?.value || '';
      
      // API call to compiler service (mock)
      // const response = await fetch('/api/compiler/run', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     code,
      //     language,
      //     input: customInput,
      //     testCases: question.testCases || []
      //   })
      // });

      // Mock result for demo
      const result = { success: true, results: [{ hasOutput: true, actual: 'Mock output' }] };
      
      if (result.success) {
        // Handle compilation errors first
        if (result.compilationError) {
          setOutput(`COMPILATION ERROR:\n${result.compilationError.error}`);
          setTestResults([]);
        } else {
          // Display output from first test case or custom input
          const firstResult = result.results[0];
          if (firstResult.hasOutput) {
            setOutput(firstResult.actual);
          } else if (firstResult.hasErrors) {
            setOutput(`RUNTIME ERROR:\n${firstResult.error}`);
          } else {
            setOutput('Program executed successfully (no output)');
          }
          
          setTestResults(result.results || []);
        }
        setShowResults(true);
      } else {
        setOutput(`ERROR: ${result.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setOutput(`ERROR: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageTemplate = (lang) => {
    const templates = {
      python: `# Write your Python solution here
def solve():
    # Your code here
    pass

if __name__ == "__main__":
    solve()`,
      java: `// Write your Java solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
      javascript: `// Write your JavaScript solution here
function solve() {
    // Your code here
}

solve();`,
      cpp: `// Write your C++ solution here
#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
      c: `// Write your C solution here
#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`
    };
    return templates[lang] || templates.python;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => onCodeChange(question._id, code, e.target.value)}
              className="input text-sm"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
            
            <button
              onClick={() => handleCodeChange(getLanguageTemplate(language))}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Load Template
            </button>
          </div>
          
          <button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            className="btn-primary flex items-center text-sm"
          >
            {isRunning ? (
              <>
                <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
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
      </div>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Code Editor</h3>
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-96 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Input (Optional)</h3>
          <textarea
            id="custom-input"
            className="w-full h-24 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-2"
            placeholder="Enter input for your program (if required)..."
            spellCheck={false}
          />
          
          <h3 className="text-sm font-medium text-gray-700 mb-2">Output</h3>
          <div className={`w-full h-64 p-3 font-mono text-sm rounded-lg overflow-auto ${
            output.includes('ERROR') || output.includes('COMPILATION ERROR') || output.includes('RUNTIME ERROR')
              ? 'bg-red-900 text-red-400'
              : 'bg-gray-900 text-green-400'
          }`}>
            {output || 'Run your code to see the output...'}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {showResults && testResults.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Test Results</h3>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  test.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Test Case {index + 1}
                  </span>
                  {test.passed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="mt-2 text-sm">
                  <div>
                    <span className="font-medium">Input:</span>
                    <code className="ml-2 text-gray-600">{test.input || '(No input)'}</code>
                  </div>
                  {test.expected && (
                    <div>
                      <span className="font-medium">Expected:</span>
                      <code className="ml-2 text-gray-600">{test.expected}</code>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Your Output:</span>
                    <code className="ml-2 text-gray-600">{test.actual || '(No output)'}</code>
                  </div>
                  {!test.passed && test.error && (
                    <div className="mt-2">
                      <span className="font-medium text-red-600">Error:</span>
                      <pre className="ml-2 text-red-600 text-xs bg-red-50 p-2 rounded">
                        {test.error}
                      </pre>
                    </div>
                  )}
                  {test.compilationError && (
                    <div className="mt-2">
                      <span className="font-medium text-orange-600">Compilation Error:</span>
                      <pre className="ml-2 text-orange-600 text-xs bg-orange-50 p-2 rounded">
                        {test.compilationError.error}
                      </pre>
                    </div>
                  )}
                  {test.executionTime && (
                    <div className="mt-1 text-xs text-gray-500">
                      Execution time: {test.executionTime}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Score: {testResults.filter(t => t.passed).length}/{testResults.length}
              </span>
              <span className="text-sm text-gray-600">
                ({Math.round((testResults.filter(t => t.passed).length / testResults.length) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Problem Description */}
      {question.description && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Problem Description</h3>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {question.description}
          </div>
        </div>
      )}

      {/* Sample Input/Output */}
      {(question.sampleInput || question.sampleOutput) && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sample</h3>
          {question.sampleInput && (
            <div className="mb-2">
              <span className="text-sm font-medium">Input:</span>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-sm">
                {question.sampleInput}
              </pre>
            </div>
          )}
          {question.sampleOutput && (
            <div>
              <span className="text-sm font-medium">Output:</span>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-sm">
                {question.sampleOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingEditor;
