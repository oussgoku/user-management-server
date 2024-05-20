const express = require('express');
const companyController = require('../controllers/companyController');
const { protect, checkTokenBlacklist } = require('../middleware/auth');

const router = express.Router();

router.post('/register', companyController.registerCompany);
router.post('/login', companyController.loginCompany);
router.post('/logout', protect, companyController.logoutCompany); // Added logout route

router.get('/', protect, checkTokenBlacklist, companyController.getCompanies);
router.put('/:id', protect, checkTokenBlacklist, companyController.updateCompany);
router.delete('/:id', protect, checkTokenBlacklist, companyController.deleteCompany);
router.post('/:id/employees', protect, checkTokenBlacklist, companyController.addEmployeeToCompany);
router.delete('/:id/employees', protect, checkTokenBlacklist, companyController.removeEmployeeFromCompany);

module.exports = router;
