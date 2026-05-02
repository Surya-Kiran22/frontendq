const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyBranchMapping,
  getAllCompanyBranchMappings,
} = require('../controllers/companyController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllCompanies);
router.get('/mappings', protect, adminOnly, getAllCompanyBranchMappings);
router.get('/:id', protect, getCompanyById);
router.post('/', protect, adminOnly, createCompany);
router.put('/:id', protect, adminOnly, updateCompany);
router.delete('/:id', protect, adminOnly, deleteCompany);
router.put('/:id/branch-mapping', protect, adminOnly, updateCompanyBranchMapping);

module.exports = router;
