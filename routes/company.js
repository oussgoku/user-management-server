const express = require('express');
const companyController = require('../controllers/companyController');
const { protect, checkTokenBlacklist } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/companies/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - address
 *               - companySize
 *               - password
 *               - phoneNumber
 * 
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *               companySize:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company registered successfully
 */
router.post('/register', companyController.registerCompany);

/**
 * @swagger
 * /api/companies/login:
 *   post:
 *     summary: Login a company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company logged in successfully
 */
router.post('/login', companyController.loginCompany);

/**
 * @swagger
 * /api/companies/logout:
 *   post:
 *     summary: Logout a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company logged out successfully
 */
router.post('/logout', protect, companyController.logoutCompany);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get('/', protect, checkTokenBlacklist, companyController.getCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               companySize:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.put('/:id', protect, checkTokenBlacklist, companyController.updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */
router.delete('/:id', protect, checkTokenBlacklist, companyController.deleteCompany);

/**
 * @swagger
 * /api/companies/{id}/employees:
 *   post:
 *     summary: Add an employee to a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee added to company successfully
 */
router.post('/:id/employees', protect, checkTokenBlacklist, companyController.addEmployeeToCompany);

/**
 * @swagger
 * /api/companies/{id}/employees:
 *   delete:
 *     summary: Remove an employee from a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee removed from company successfully
 */
router.delete('/:id/employees', protect, checkTokenBlacklist, companyController.removeEmployeeFromCompany);

module.exports = router;
