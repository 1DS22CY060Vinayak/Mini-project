const express = require('express');
const router = express.Router();
const { getFeedbacks, createFeedback } = require('../controllers/feedbackController.js');
const { protect } = require('../middlewares/authMiddleware.js');

router.get('/', protect, getFeedbacks);
router.post('/', protect, createFeedback);

module.exports = router;
