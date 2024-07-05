const express = require('express');
const router = express.Router();
const { getCourses, createCourse } = require('../controllers/courseController.js');
const { protect } = require('../middlewares/authMiddleware.js');

router.get('/', protect, getCourses);
router.post('/', protect, createCourse);

module.exports = router;
