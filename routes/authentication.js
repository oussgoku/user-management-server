// routes/auth.js
const express = require('express');
const router = express.Router();
const Company = require('../model/Company');
const Employee = require('../model/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try to find the user in companies
    let user = await Company.findOne({ email });
    let userType = 'company';

    // If not found, try to find the user in employees
    if (!user) {
      user = await Employee.findOne({ email });
      userType = 'employee';
    }

    // If user is not found in both, return an error
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, type: userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post('/register', async (req, res) => {
  const { type, name, email, address, companySize, password, phoneNumber, position } = req.body;

  if (!type || (type !== 'company' && type !== 'employee')) {
    return res.status(400).json({ message: 'Invalid type. Must be either company or employee.' });
  }

  try {
    if (type === 'company') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCompany = new Company({ name, email, address, companySize, password: hashedPassword, phoneNumber });
      await newCompany.save();
      return res.status(201).json({ message: 'Company registered successfully' });
    } else if (type === 'employee') {
      const tempPassword = crypto.randomBytes(8).toString('hex'); // Generate temporary password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const newEmployee = new Employee({ name, position, email, password: hashedPassword });
      await newEmployee.save();

      // Sending email logic
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Your Temporary Password',
        text: `Hello ${name},\n\nYour temporary password is: ${tempPassword}\n\nPlease change it after logging in.\n`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent:', info.response);
        }
      });

      return res.status(201).json({ message: 'Employee registered successfully. Temporary password sent via email.' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
