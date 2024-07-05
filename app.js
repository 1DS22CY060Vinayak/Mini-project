// app.js (or index.js)

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../models/user.js'); // Your Mongoose User model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Database connection
mongoose.connect('mongodb://localhost:27017/education-support-platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

// Routes
app.post('/signup', async (req, res) => {
    const { name, username, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role
        });

        // Save user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Set session for authenticated user
        req.session.user = user;

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// Example route to fetch teachers from MongoDB
app.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find({}, 'name email'); // Assuming you have a Teacher model with 'name' and 'email' fields
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});
// app.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const assignmentsRouter = require('./routes/assignments.js');

const app3 = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/education-support-platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/', assignmentsRouter);

// Start server
const PORT3 = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
document.addEventListener('DOMContentLoaded', function() {
    const resourceUploadForm = document.getElementById('resource-upload-form');

    resourceUploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(resourceUploadForm);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resource uploaded:', data);
            // Optionally, update UI or show confirmation message
            alert('Resource uploaded successfully!');
        })
        .catch(error => {
            console.error('Error uploading resource:', error);
            // Handle error scenario
            alert('Failed to upload resource. Please try again later.');
        });
    });
});
const express = require('express');
const multer = require('multer');
const session = require('express-session');

const app4 = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Set up session management
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Middleware to simulate authentication and role assignment
app.use((req, res, next) => {
    // Simulate a logged-in user with a role
    // In a real application, you would fetch this from the database
    req.session.user = {
        username: 'teacher1',
        role: 'teacher' // Can be 'student', 'teacher', or 'admin'
    };
    next();
});

// Middleware to check if the user is a teacher or admin
function checkRole(req, res, next) {
    if (req.session.user && (req.session.user.role === 'teacher' || req.session.user.role === 'admin')) {
        next();
    } else {
        res.status(403).send('Permission denied');
    }
}

// Route to handle resource upload (only for teachers and admins)
app.post('/upload-resource', checkRole, upload.single('file'), (req, res) => {
    // Handle the file upload
    res.send('Resource uploaded successfully');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
