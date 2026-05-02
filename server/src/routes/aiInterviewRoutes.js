const express = require('express');
const router = express.Router();
const aiInterviewController = require('../controllers/aiInterviewController');
const { protect } = require('../middleware/auth');

router.get('/placement-status', protect, aiInterviewController.checkPlacementStatus);
router.post('/submit', protect, aiInterviewController.submitInterview);

module.exports = router;
