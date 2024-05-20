const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../model/Employee');
const secretKey = 'your_secret_key';

exports.registerEmployee = async (req, res) => {
    const { name, position, email, password } = req.body;
    try {
        const newEmployee = new Employee({ name, position, email, password });
        await newEmployee.save();
        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginEmployee = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
