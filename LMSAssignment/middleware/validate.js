const Joi = require('joi');

exports.validateRegister = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').optional()
});

exports.validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.validateCourse = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  price: Joi.number().min(0).required()
});

exports.validateQuizAttempt = Joi.object({
  quizId: Joi.number().required(),
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().required(),
      selectedOption: Joi.number().required()
    })
  ).required()
});