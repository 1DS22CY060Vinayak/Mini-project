// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['assignment', 'quiz'], required: true },
    // Add more fields as needed (e.g., dueDate, attachments)
});

module.exports = mongoose.model('Assignment', assignmentSchema);
