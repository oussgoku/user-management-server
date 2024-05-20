const express = require('express');
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', companyController.registerCompany);
router.post('/login', companyController.loginCompany);
router.get('/', protect, companyController.getCompanies);
router.put('/:id', protect, companyController.updateCompany);
router.delete('/:id', protect, companyController.deleteCompany);
router.post('/:id/employees', protect, companyController.addEmployeeToCompany);

module.exports = router;
