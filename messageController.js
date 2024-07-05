const Message = require('../models/message.js');

// GET all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single message
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create new message
exports.createMessage = async (req, res) => {
    const { content, senderId, receiverId } = req.body;

    try {
        const newMessage = new Message({ content, senderId, receiverId });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update message
exports.updateMessage = async (req, res) => {
    const { content } = req.body;

    try {
        const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { content }, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(updatedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE message
exports.deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
