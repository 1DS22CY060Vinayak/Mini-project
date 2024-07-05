// routes/resources.js

const express = require('express');
const router = express.Router();
const Resource = require('../models/resource.js');

// Upload resource route
router.post('/resources', async (req, res) => {
    const { title, description, uploadedBy } = req.body;

    try {
        // Create new resource
        const newResource = new Resource({
            title,
            description,
            uploadedBy // Should be ObjectId of the user who uploaded it
        });

        // Save resource to database
        await newResource.save();

        // Return success message
        res.status(201).json({ message: 'Resource uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch all resources route
router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
