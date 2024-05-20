// Import JWT and bcrypt library
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel'); // Assuming User model is in User.js

// Handle user registration
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Generate tokens
        const accessToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ user_id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d",
        });

        // Save the refresh token
        user.refreshToken = refreshToken;
        await user.save();
        res
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken)
            .send(user);
        res.status(201).json({
            status: 'success',
            user
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

// Handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = jwt.sign({ user: { email: user.email, role: user.role } }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ user: { email: user.email, role: user.role } }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', accessToken)
        .status(200)
        .json({
            status: 'success',
            accessToken, // Include accessToken in the response body
            user
        });
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    console.log(refreshToken);
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ user: decoded.user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        console.log(decoded.user);
        res
            .header('Authorization', accessToken)
            .send(decoded.user);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Invalid refresh token.');
    }
}

module.exports = { registerUser, loginUser, refreshToken };
