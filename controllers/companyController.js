const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../model/Company');

let tokenBlacklist = [];

exports.registerCompany = async (req, res) => {
    const { name, address, companySize, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCompany = new Company({ name, address, companySize, password: hashedPassword });
        await newCompany.save();
        res.status(201).json({ message: 'Company registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginCompany = async (req, res) => {
    const { name, password } = req.body;
    try {
        const company = await Company.findOne({ name });
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logoutCompany = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is in the "Authorization" header

    if (!token) return res.status(400).json({ message: 'No token provided' });

    tokenBlacklist.push(token);
    res.json({ message: 'Logged out successfully' });
};

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate('employees');
        res.json(companies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addEmployeeToCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        company.employees.push(req.body.employeeId);
        await company.save();
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removeEmployeeFromCompany = async (req, res) => { // Corrected function name to removeEmployeeFromCompany
    try {
        const company = await Company.findById(req.params.id);
        company.employees.pull(req.body.employeeId);
        await company.save();
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


