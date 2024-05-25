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
// Forget Password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Company.findOne({ email });
    let userType = 'company';

    if (!user) {
      user = await Employee.findOne({ email });
      userType = 'employee';
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await user.save();

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
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Password reset email sent' });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset Password route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    let user = await Company.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await Employee.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    }

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
