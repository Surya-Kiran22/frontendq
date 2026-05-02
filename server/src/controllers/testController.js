const Test = require('../models/Test');
const TestResult = require('../models/TestResult');

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true });
    res.json({
      success: true,
      tests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json({
      success: true,
      message: 'Test deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTest = async (req, res) => {
  try {
    const { testId, answers, startedAt, tabSwitches, proctoringData } = req.body;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Calculate score
    let score = 0;
    let totalScore = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = test.questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question) {
        totalScore += question.marks;
        const isCorrect = answer.answer === question.correctAnswer;
        if (isCorrect) {
          score += question.marks;
        }
        processedAnswers.push({
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          timeTaken: answer.timeTaken,
          code: answer.code
        });
      }
    }

    const percentage = (score / totalScore) * 100;
    const passed = percentage >= test.passingScore;
    const submittedAt = new Date();
    const timeTaken = Math.round((submittedAt - new Date(startedAt)) / 1000 / 60); // in minutes

    const testResult = await TestResult.create({
      testId,
      userId,
      score,
      totalScore,
      percentage,
      passed,
      answers: processedAnswers,
      startedAt,
      submittedAt,
      timeTaken,
      tabSwitches,
      proctoringData
    });

    res.json({
      success: true,
      result: {
        score,
        totalScore,
        percentage,
        passed,
        testResultId: testResult._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await TestResult.find({ userId })
      .populate('testId', 'title description type duration')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestResultById = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id)
      .populate('testId')
      .populate('userId', 'name rollNumber email');

    if (!result) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    // Only allow admin or the user who took the test to view results
    if (req.user.role !== 'admin' && result.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
  getTestResults,
  getTestResultById,
};
