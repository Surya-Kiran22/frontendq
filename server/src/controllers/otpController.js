const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map();

const otpController = {
  sendEmailOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Generate 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      
      // Store OTP with expiration (5 minutes)
      otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@placement-system.com',
        to: email,
        subject: 'Email Verification OTP - Placement System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        message: 'OTP sent to email successfully'
      });
    } catch (error) {
      console.error('Error sending email OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  },

  verifyEmailOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }

      const storedOTP = otpStore.get(email);

      if (!storedOTP) {
        return res.status(400).json({ success: false, message: 'OTP not found or expired' });
      }

      if (Date.now() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }

      // Remove OTP after successful verification
      otpStore.delete(email);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Error verifying email OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
  },

  sendPhoneOTP: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }

      // Generate 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      
      // Store OTP with expiration (5 minutes)
      otpStore.set(phoneNumber, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
      });

      // Note: For actual SMS, you would use services like Twilio, AWS SNS, etc.
      // For now, we'll return the OTP in the response for testing
      // In production, integrate with an SMS service
      
      res.json({
        success: true,
        message: 'OTP sent to phone successfully',
        // Remove this in production - only for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  },

  verifyPhoneOTP: async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
      }

      const storedOTP = otpStore.get(phoneNumber);

      if (!storedOTP) {
        return res.status(400).json({ success: false, message: 'OTP not found or expired' });
      }

      if (Date.now() > storedOTP.expiresAt) {
        otpStore.delete(phoneNumber);
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }

      // Remove OTP after successful verification
      otpStore.delete(phoneNumber);

      res.json({
        success: true,
        message: 'Phone verified successfully'
      });
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
  }
};

module.exports = otpController;
