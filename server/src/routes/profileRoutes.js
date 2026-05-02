const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProfile,
  createOrUpdateProfile,
  uploadDocument,
  getAllProfiles,
  getProfileByUserId,
} = require('../controllers/profileController');
const { protect, adminOnly } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', protect, getProfile);
router.post('/', protect, createOrUpdateProfile);
router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/all', protect, adminOnly, getAllProfiles);
router.get('/user/:userId', protect, adminOnly, getProfileByUserId);

module.exports = router;
