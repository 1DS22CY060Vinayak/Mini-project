const express = require('express');
const router1 = express.Router();
const UserController = require('../controllers/userController.js');
const CourseController = require('../controllers/courseController.js');
const AuthMiddleware = require('../middlewares/authMiddleware.js');

// User routes
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

// Course routes
router.get('/courses', AuthMiddleware, CourseController.getCourses);
router.post('/courses', AuthMiddleware, CourseController.createCourse);

// Add other routes for feedback, chat, profile, etc.

module.exports = router;
const express = require('express');
const router2 = express.Router();
const UserController = require('../controllers/userController.js');
const CourseController = require('../controllers/courseController.js');
const MessageController = require('../controllers/messageController.js');
const AuthMiddleware = require('../middlewares/authMiddleware.js');

// User routes
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

// Course routes
router.get('/courses', AuthMiddleware, CourseController.getCourses);
router.post('/courses', AuthMiddleware, CourseController.createCourse);

// Message routes
router.get('/messages', AuthMiddleware, MessageController.getMessages);
router.post('/messages', AuthMiddleware, MessageController.createMessage);

module.exports = router;
// routes/auth.js (or similar)

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

// Login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

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
// routes/auth.js (or similar)

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Signup route
router.post('/signup', async (req, res) => {
    const { name, username, email, password, role } = req.body;

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
            password,
            role
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
// routes/assignments.js
const express = require('express');
const router3 = express.Router();
const Assignment = require('../models/assignment.js');

// Route to get all assignments
router.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});

// Route to create a new assignment
router.post('/assignments', async (req, res) => {
    const { title, description, type } = req.body;
    try {
        const newAssignment = new Assignment({ title, description, type });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
});

module.exports = router;
app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
    User.register(new User({ username, role }), password, (err, user) => {
      if (err) {
        return res.redirect('/signup.html');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/resources.html');
      });
    });
  });
  