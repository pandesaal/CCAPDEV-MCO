const express = require('express');

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const getPostData = require('../controllers/get-post')

const { loginUser } = require('../controllers/login');
const { registerUser } = require('../controllers/register');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', loginUser);

router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', registerUser);

router.get('/', home);
router.get('/:username', profile);
router.get('/search', search);
router.get('/post/:id', post);

module.exports = router;
