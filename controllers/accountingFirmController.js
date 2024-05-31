const AccountingFirm = require('../model/AccountingFirm');

async function createAccountingFirm(req, res) {
    try {
        const newFirm = new AccountingFirm(req.body);
        await newFirm.save();
        res.status(201).json(newFirm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAccountingFirms(req, res) {
    try {
        const firms = await AccountingFirm.find().populate('experts');
        res.status(200).json(firms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAccountingFirmById(req, res) {
    try {
        const firm = await AccountingFirm.findById(req.params.id).populate('experts');
        if (!firm) {
            return res.status(404).json({ message: 'Accounting firm not found' });
        }
        res.status(200).json(firm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateAccountingFirm(req, res) {
    try {
        const updatedFirm = await AccountingFirm.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('experts');
        if (!updatedFirm) {
            return res.status(404).json({ message: 'Accounting firm not found' });
        }
        res.status(200).json(updatedFirm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteAccountingFirm(req, res) {
    try {
        const deletedFirm = await AccountingFirm.findByIdAndDelete(req.params.id);
        if (!deletedFirm) {
            return res.status(404).json({ message: 'Accounting firm not found' });
        }
        res.status(200).json({ message: 'Accounting firm deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createAccountingFirm,
    getAccountingFirms,
    getAccountingFirmById,
    updateAccountingFirm,
    deleteAccountingFirm,
};
