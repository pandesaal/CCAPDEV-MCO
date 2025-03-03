const express = require('express');

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const { createPost, editPost, deletePost } = require('../controllers/createPost');
const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');
const getTags = require('../controllers/get-tags');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', signupUser);
router.post('/createPost', createPost);
router.put('/editPost', editPost);
router.delete('/deletePost', deletePost);

router.get('/tags', getTags);
router.get('/', home);
router.get('/search', search);
router.get('/post/:id', post);
router.get('/:username', profile);

module.exports = router;