const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.post('/register', employeeController.registerEmployee);
router.post('/login', employeeController.loginEmployee);

module.exports = router;
