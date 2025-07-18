const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getAllCourses, getCourse, createCourse, enrollInCourse } = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validate');
const validateBody = require('../middleware/validateBody'); 

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourse);

router.use(protect);

router.post('/:courseId/enroll', enrollInCourse);

router.post('/', restrictTo('admin'), validateBody(validateCourse), createCourse);

module.exports = router;
