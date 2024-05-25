const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    field: { type: String, required: true },
    experience: { type: Number, required: true },
    salary: {
        type: Number, required: true, default: 0.0
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountingFirm', required: true }
});

const Expert = mongoose.model('Expert', expertSchema);

module.exports = Expert;
