
const express = require('express');
const router = express.Router();
const accountingFirmController = require('../controllers/accountingFirmController');

router.post('/accountingFirms', accountingFirmController.createAccountingFirm);
router.get('/accountingFirms', accountingFirmController.getAccountingFirms);
router.get('/accountingFirms/:id', accountingFirmController.getAccountingFirmById);
router.put('/accountingFirms/:id', accountingFirmController.updateAccountingFirm);
router.delete('/accountingFirms/:id', accountingFirmController.deleteAccountingFirm);

module.exports = router;
