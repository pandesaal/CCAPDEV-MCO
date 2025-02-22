const express = require('express');
const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');

const router = express.Router();
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;