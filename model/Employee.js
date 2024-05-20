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
    dateHired: {
        type: Date,
        default: Date.now
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
