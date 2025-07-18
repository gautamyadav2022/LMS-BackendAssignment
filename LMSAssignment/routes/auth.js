const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const validateBody = require('../middleware/validateBody');

router.post('/register', validateBody(validateRegister), authController.register);
router.post('/login', validateBody(validateLogin), authController.login);

module.exports = router;
