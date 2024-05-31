const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    companySize: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    creatorFirstName: {
        type: String,
        required: true
    },
    creatorLastName: {
        type: String,
        required: true
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
