const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    position: { type: String, required: true },
    salary: {
        type: Number,
        default: 0.0
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    dateOfBirth: {
        type: Date
    },
    hireDate: {
        type: Date,
        default: Date.now
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});
employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        /**
         * Hashes the password using bcrypt.
         * @param {string} this.password - The password to be hashed.
         * @returns {string} The hashed password.
         */
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
