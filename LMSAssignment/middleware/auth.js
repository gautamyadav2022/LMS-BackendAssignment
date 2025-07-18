const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ErrorHandler = require('./error').ErrorHandler;

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new ErrorHandler('Not authorized', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) return next(new ErrorHandler('User no longer exists', 401));

  req.user = user;
  next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorHandler('Unauthorized access', 403));
  }
  next();
};
