const express = require('express');
const router = express.Router();
const {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
  getTestResults,
  getTestResultById,
} = require('../controllers/testController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllTests);
router.get('/results', protect, getTestResults);
router.get('/results/:id', protect, getTestResultById);
router.get('/:id', protect, getTestById);
router.post('/', protect, adminOnly, createTest);
router.put('/:id', protect, adminOnly, updateTest);
router.delete('/:id', protect, adminOnly, deleteTest);
router.post('/:id/submit', protect, submitTest);

module.exports = router;
