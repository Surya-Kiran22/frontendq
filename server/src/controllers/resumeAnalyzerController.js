const { uploadToS3 } = require('../config/aws');
const Company = require('../models/Company');

const resumeAnalyzerController = {
  analyzeResume: async (req, res) => {
    try {
      const { fileData, userProfile } = req.body;

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get all companies from database
      const companies = await Company.find({ isActive: true });
      
      // Mock analysis results
      const eligibleCompanies = [];
      const notEligibleCompanies = [];
      
      companies.forEach((company, index) => {
        const eligibilityScore = Math.random();
        const reasons = [];
        
        if (userProfile.cgpa < company.eligibility.cgpa) {
          reasons.push(`CGPA requirement: ${company.eligibility.cgpa} (Your CGPA: ${userProfile.cgpa})`);
        }
        
        if (!company.eligibility.departments.includes(userProfile.department)) {
          reasons.push(`Branch requirement: ${company.eligibility.departments.join(', ')}`);
        }
        
        if (company.eligibility.backlogAllowed === false && userProfile.backlogs > 0) {
          reasons.push('No backlogs allowed');
        }
        
        const isEligible = eligibilityScore > 0.3 && reasons.length === 0;
        
        if (isEligible) {
          eligibleCompanies.push({
            company: company.name,
            companyId: company._id,
            matchScore: Math.floor(eligibilityScore * 100),
            reasons: reasons.length > 0 ? reasons : ['Meets all eligibility criteria']
          });
        } else {
          notEligibleCompanies.push({
            company: company.name,
            companyId: company._id,
            matchScore: Math.floor(eligibilityScore * 100),
            reasons: reasons.length > 0 ? reasons : ['Does not meet criteria']
          });
        }
      });
      
      const analysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        eligibleCompanies: eligibleCompanies.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10),
        notEligibleCompanies: notEligibleCompanies.slice(0, 5),
        improvements: [
          'Improve CGPA to increase eligibility',
          'Add more relevant projects',
          'Complete certifications in required skills',
          'Gain experience through internships'
        ],
        skillsMatch: Math.floor(Math.random() * 30) + 70,
        experienceMatch: Math.floor(Math.random() * 30) + 70
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

module.exports = resumeAnalyzerController;
