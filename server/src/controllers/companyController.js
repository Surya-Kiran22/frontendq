const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  try {
    const user = req.user;
    let query = { isActive: true };

    // Filter by user's department if student
    if (user.role === 'student') {
      query.$or = [
        { isCommonToAll: true },
        { assignedBranches: user.department }
      ];
    }

    const companies = await Company.find(query);
    res.json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompanyBranchMapping = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { isCommonToAll, assignedBranches } = req.body;

    const company = await Company.findByIdAndUpdate(
      companyId,
      { isCommonToAll, assignedBranches },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCompanyBranchMappings = async (req, res) => {
  try {
    const companies = await Company.find({}, {
      name: 1,
      isCommonToAll: 1,
      assignedBranches: 1,
      eligibility: 1
    });

    res.json({
      success: true,
      mappings: companies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyBranchMapping,
  getAllCompanyBranchMappings,
};
