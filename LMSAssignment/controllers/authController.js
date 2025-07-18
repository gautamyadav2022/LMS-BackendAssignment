const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const ErrorHandler = require('../middleware/error').ErrorHandler;
const { UniqueConstraintError } = require('sequelize');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    const newUser = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return next(new ErrorHandler('User with this email or username already exists', 400));
    }
    next(err); 
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler('Please provide email and password', 400));

  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password)))
    return next(new ErrorHandler('Incorrect email or password', 401));

  const token = signToken(user.id);
  user.password = undefined;
  res.status(200).json({ status: 'success', token, data: { user } });
};
