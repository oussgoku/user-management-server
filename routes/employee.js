const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new employee
 *     tags:
 *       - Employee
 *     requestBody:
 *       description: Employee data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login as an employee
 *     tags:
 *       - Employee
 *     requestBody:
 *       description: Employee credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/login', employeeController.loginEmployee);
router.post('/employees', employeeController.createEmployee);
router.get('/employees', employeeController.getEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);
router.put('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

module.exports = router;
