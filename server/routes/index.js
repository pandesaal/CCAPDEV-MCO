const express = require('express');
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

module.exports = router;
