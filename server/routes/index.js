const express = require('express');

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', signupUser);

router.get('/', home);
router.get('/:username', profile);
router.get('/search', search);
router.get('/post/:id', post);

module.exports = router;