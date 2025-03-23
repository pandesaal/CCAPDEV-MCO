require('dotenv').config();

const clearDb = require('../controllers/admin');

const express = require('express');
const mongoose = require('mongoose');

const multer = require('multer');
const { GridFSBucket } = require('mongodb');

const session = require('express-session');
const MongoDBSession =  require('connect-mongodb-session')(session);

const home = require('./pages/home');
const profile = require('./pages/profile');
const search = require('./pages/search');
const post = require('./pages/post');

const { loginUser, logoutUser, checkSession } = require('../controllers/login');
const { signupUser } = require('../controllers/signup');
const getTags = require('../controllers/get-tags');
const { createPost, editPost, deletePost, toggleLike, toggleDislike, checkLikeStatus, checkDislikeStatus, checkIfEditedPost } = require('../controllers/post');
const { createComment, editComment, deleteComment, toggleLikeComment, checkLikeCommentStatus, checkIfEditedComment } = require('../controllers/comment');

const { deleteFile, editUser, deleteUser } = require('../controllers/user');

const router = express.Router();

const store = new MongoDBSession({ 
    uri: process.env.MONGODB, 
    collection: 'sessions' 
});

router.use(
    session({
        secret: 'ccapdev mco yippee',
        resave: false,
        cookie: { maxAge: 1.814e9 }, // 3 weeks in ms.. atleast un sabi ni google...
        saveUninitialized: false,
        store: store
    })
);

const verify = (req, res, next) => {
    const acceptHeader = req.get('Accept');

    if (!acceptHeader || acceptHeader.includes('text/html')) {
        return res.status(404).render('404', {layout: false});
    }

    next();
}

// admin commands
router.delete('/clearDb', clearDb);

router.post('/login', loginUser);
router.get('/logout', verify, logoutUser);
router.post('/register', signupUser);

router.post('/createPost', createPost);
router.put('/editPost', editPost);
router.delete('/deletePost', deletePost);
router.put('/toggleLike', toggleLike);
router.put('/toggleDislike', toggleDislike);
router.post('/checkIfEditedPost', checkIfEditedPost);

router.post('/createComment', createComment);
router.put('/editComment', editComment);
router.delete('/deleteComment', deleteComment);
router.put('/toggleLikeComment', toggleLikeComment);
router.post('/checkIfEditedComment', checkIfEditedComment);

router.delete('/deleteUser', deleteUser);
router.get('/checkSession', verify, checkSession);

router.get('/api/likedPosts', verify, checkLikeStatus);
router.get('/api/dislikedPosts', verify, checkDislikeStatus);
router.get('/api/likedComments', verify, checkLikeCommentStatus);
router.get('/api/tags', verify, getTags);

router.get('/', home);
router.get('/search', search);
router.get('/about', (req, res) => {
    res.render('about', {layout: false});
});
router.get('/post/:id', post);
router.get('/user/:username', profile);

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = new GridFSBucket(conn, { bucketName: 'uploads' });
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

// for icons to appear in pages
router.get('/image/:id', verify, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid ID format');
        }

        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const cursor = gfs.find({ _id: fileId });
        const files = await cursor.toArray();
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
router.post('/editUser', upload.single('icon'), editUser);
router.delete('/deleteFile', deleteFile);

module.exports = router;