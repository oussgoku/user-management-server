const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../model/Employee');

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


// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const { name, position, email, password, company, salary, phone, address, dateOfBirth, companyId } = req.body;
        const newEmployee = new Employee({ name, position, email, password, company, salary, phone, address, dateOfBirth, companyId });
        const employee = await newEmployee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('company');
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('company');
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
    try {
        const { name, position, email, password, company, salary, phone, address, dateOfBirth, companyId } = req.body;
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        // Update employee fields
        employee.name = name || employee.name;
        employee.position = position || employee.position;
        employee.email = email || employee.email;
        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }
        employee.company = company || employee.company;
        employee.salary = salary || employee.salary;
        employee.phone = phone || employee.phone;
        employee.address = address || employee.address;
        employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;
        employee.companyId = companyId || employee.companyId;

        const updatedEmployee = await employee.save();
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
