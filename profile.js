// routes/profile.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to verify JWT token
const User = require('.app./models/User');

// Update profile route
router.put('/profile', auth, async (req, res) => {
    const userId = req.user.id; // From auth middleware
    const { educationalQualifications, projects } = req.body;

    try {
        // Find user by ID
        let user = await User.findById(userId);

        // Update user's educational qualifications and projects
        user.educationalQualifications = educationalQualifications;
        user.projects = projects;

        // Save updated user profile
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
