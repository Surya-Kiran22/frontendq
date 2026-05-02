const compilerController = {
  compile: async (req, res) => {
    try {
      const { code, language, testCases } = req.body;

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
      
      const summary = {
        total: testCases.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        totalExecutionTime: results.reduce((sum, r) => sum + parseFloat(r.executionTime), 0).toFixed(3)
      };
      
      res.json({
        success: true,
        allPassed,
        results,
        summary
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

function generateWrongOutput(expectedOutput) {
  // Generate a wrong output for demo purposes
  if (!expectedOutput) return 'Error: No output';
  const chars = expectedOutput.split('');
  const wrongChars = chars.map(c => {
    if (c === ' ') return c;
    if (Math.random() > 0.7) {
      return String.fromCharCode(c.charCodeAt(0) + 1);
    }
    return c;
  });
  return wrongChars.join('');
}

module.exports = compilerController;
