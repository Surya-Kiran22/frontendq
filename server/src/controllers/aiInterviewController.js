const Profile = require('../models/Profile');

const aiInterviewController = {
  checkPlacementStatus: async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.user._id });
      const placed = profile?.placementStatus === 'Placed';
      
      res.json({
        success: true,
        isPlaced: placed
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  submitInterview: async (req, res) => {
    try {
      const { answers } = req.body;
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const analysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        communicationScore: Math.floor(Math.random() * 30) + 70,
        technicalScore: Math.floor(Math.random() * 30) + 70,
        confidenceScore: Math.floor(Math.random() * 30) + 70,
        feedback: [
          'Good communication skills',
          'Clear articulation of concepts',
          'Need more practice on technical questions',
          'Confidence level is good'
        ],
        recommendedImprovements: [
          'Practice more technical interviews',
          'Work on problem-solving speed',
          'Improve depth of technical knowledge'
        ]
      };
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = aiInterviewController;
