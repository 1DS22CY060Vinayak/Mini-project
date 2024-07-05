// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

// Signup route
router.post('/signup', async (req, res) => {
    const { name, username, email, password, role, educationalQualifications, projects } = req.body;

    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password, // Should be hashed in a real-world scenario
            role,
            educationalQualifications,
            projects
        });

        // Save user to database
        await newUser.save();

        // Return success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        let user = await User.findOne({ username });

        // If user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, 'jwtSecret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
