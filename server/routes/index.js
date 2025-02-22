const express = require('express');
const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', loginUser);

router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', signupUser);

module.exports = router;
