const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
    // Register User
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Login User
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id)
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

module.exports = userController;