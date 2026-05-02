const express = require('express');
const router = express.Router();
const compilerController = require('../controllers/compilerController');
const { protect } = require('../middleware/auth');

router.post('/compile', protect, compilerController.compile);

module.exports = router;
