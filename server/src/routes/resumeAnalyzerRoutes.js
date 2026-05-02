const express = require('express');
const router = express.Router();
const resumeAnalyzerController = require('../controllers/resumeAnalyzerController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, resumeAnalyzerController.analyzeResume);

module.exports = router;
