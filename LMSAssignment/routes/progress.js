const express = require('express');
const { protect } = require('../middleware/auth');
const { completeLesson, attemptQuiz, getCourseProgress } = require('../controllers/progressController');
const { validateQuizAttempt } = require('../middleware/validate');
const validateBody = require('../middleware/validateBody'); 

const router = express.Router();

router.use(protect);

router.post('/lesson', completeLesson);
router.post('/quiz', validateBody(validateQuizAttempt), attemptQuiz); 
router.get('/:courseId', getCourseProgress);

module.exports = router;
