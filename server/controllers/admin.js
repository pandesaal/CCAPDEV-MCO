const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const gfs = new GridFSBucket(mongoose.connection, { bucketName: 'uploads' });

const clearDb = async (req, res) => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
        console.log("Cleared User, Post, and Comment collections");

        const cursor = gfs.find({});
        const files = await cursor.toArray();
        for (const file of files) {
            if (file.filename !== 'defaulticon.png') {
                await gfs.delete(file._id);
            }
        }
        console.log("Cleared uploads");

        const sessions = mongoose.connection.collection('sessions');
        await sessions.deleteMany({});
        console.log("Cleared sessions");

        res.status(200).json({ message: 'Clear successful, check database to verify.' });
    } catch (error) {
        console.error("Error while clearing database: ", error);
        res.status(500).json({ message: 'Clear unsuccessful, check console log for details.' });
    }
};

module.exports = clearDb;
