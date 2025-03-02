const express = require('express');

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');
const getTags = require('../controllers/get-tags');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', signupUser);
router.get('/api/tags', (req, res, next) => {
    const acceptHeader = req.get('Accept');

    if (!acceptHeader || acceptHeader.includes('text/html')) {
        return res.status(404).render('404', {layout: false});
    }

    next();
} , getTags);

router.get('/', home);
router.get('/search', search);
router.get('/post/:id', post);
router.get('/:username', profile);

module.exports = router;