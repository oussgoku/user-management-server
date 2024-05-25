const mongoose = require('mongoose');

const AccountingFirmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    matriculeFiscale: { type: String, required: true },
    nbreDossiersTraites: { type: Number, required: true },
    experts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],
    createdAt: { type: Date, default: Date.now },
    password: { type: String, required: true }
});

const AccountingFirm = mongoose.model('AccountingFirm', AccountingFirmSchema);

module.exports = AccountingFirm;
