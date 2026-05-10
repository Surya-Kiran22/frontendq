const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/send-email', otpController.sendEmailOTP);
router.post('/verify-email', otpController.verifyEmailOTP);
router.post('/send-phone', otpController.sendPhoneOTP);
router.post('/verify-phone', otpController.verifyPhoneOTP);

module.exports = router;
