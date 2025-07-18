const { Course, Lesson, Quiz, Enrollment, Progress, User, Question } = require('../models');
const ErrorHandler = require('../middleware/error').ErrorHandler;
const ApiFeatures = require('../utils/apiFeatures');
const { Op } = require('sequelize');

exports.getAllCourses = async (req, res, next) => {
  try {
    const features = new ApiFeatures(Course, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    const courses = await features.query;
    res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Lesson, as: 'lessons', order: [['order', 'ASC']] },
        { model: Quiz, as: 'quizzes', include: [{ model: Question, as: 'questions' }] }
      ]
    });
    
    if (!course) return next(new ErrorHandler('Course not found', 404));
    
    res.status(200).json({ status: 'success', data: { course } });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ status: 'success', data: { course } });
  } catch (err) {
    next(err);
  }
};

exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.courseId);
    if (!course) return next(new ErrorHandler('Course not found', 404));
    
    const existingEnrollment = await Enrollment.findOne({ 
      where: { user_id: req.user.id, course_id: course.id } 
    });
    
    if (existingEnrollment) return next(new ErrorHandler('Already enrolled in this course', 400));
    
    const [enrollment, progress] = await Promise.all([
      Enrollment.create({ user_id: req.user.id, course_id: course.id }),
      Progress.create({ user_id: req.user.id, course_id: course.id })
    ]);
    
    res.status(201).json({ status: 'success', data: { enrollment, progress } });
  } catch (err) {
    next(err);
  }
};