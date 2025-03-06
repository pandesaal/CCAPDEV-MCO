const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const { loginUser } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');
const getTags = require('../controllers/get-tags');
const { createPost, editPost, deletePost } = require('../controllers/post');
const { checkCommentAccess, createComment, editComment, deleteComment } = require('../controllers/comment');

const { editUser, deleteUser } = require('../controllers/editUser');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', signupUser);
router.post('/createPost', createPost);
router.put('/editPost', editPost);
router.delete('/deletePost', deletePost);
router.post('/checkCommentAccess', checkCommentAccess);
router.post('/createComment', createComment);
router.put('/editComment', editComment);
router.delete('/deleteComment', deleteComment);

router.delete('/deleteUser', deleteUser);

router.get('/api/tags', (req, res, next) => {
    const acceptHeader = req.get('Accept');

    if (!acceptHeader || acceptHeader.includes('text/html')) {
        return res.status(404).render('404', {layout: false});
    }

    next();
} , getTags);

router.get('/', home);
router.get('/search', search);
router.get('/about', (req, res) => {
    res.render('about', {layout: false});
});
router.get('/post/:id', post);
router.get('/user/:username', profile);

// for icons to appear in pages
router.get('/image/:id', async (req, res) => {
    try {
        const conn = mongoose.connection.db;
        const gfs = new GridFSBucket(conn, { bucketName: 'uploads' });

        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const files = await gfs.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).send('File not found');
        }

        res.set('Content-Type', files[0].type);
        const readStream = gfs.openDownloadStream(fileId);
        readStream.pipe(res);

    } catch (error) {
        console.error('Error streaming file:', error);
        res.status(500).send('Error retrieving file');
    }
});

module.exports = router;