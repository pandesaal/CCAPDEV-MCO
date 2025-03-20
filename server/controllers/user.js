const User = require('../models/User');
const { serverDeletePost } = require('./post');
const { serverDeleteComment } = require('./comment');

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const sharp = require('sharp');

const gfs = new GridFSBucket(mongoose.connection, { bucketName: 'uploads' });

const deleteFile = async(req, res) => {
    const { imageId } = req.body;

    try {
        gfs.delete(new mongoose.Types.ObjectId(imageId));

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFile:", error);
        res.status(500).json({ error: "Failed to delete file" });
    }
}

const editUser = async(req, res) => {
    const { username, bio } = req.body; 
    let iconId;

    try {

        if (req.file) {
            const icon = req.file;
            const resizedBuffer = await sharp(icon.buffer)
                .resize({ width: 400, height: 400, fit: 'inside' }) 
                .toBuffer(); 

            const uploadStream = gfs.openUploadStream(icon.originalname, {
                filename: `${icon.originalname}_${Date.now()}`, 
                contentType: icon.mimetype
            });
            uploadStream.end(resizedBuffer);

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', resolve);
                uploadStream.on('error', reject);
            });

            const filesCollection = mongoose.connection.db.collection('uploads.files');
            const retrievedFile = await filesCollection.findOne({ filename: icon.originalname });

            if (retrievedFile) {
                iconId = retrievedFile._id;
            } else {
                throw new Error('File metadata not found.');
            }
        }
        
        const user = await User.findOne({ 'credentials.username': username });
        await User.findByIdAndUpdate(user._id, {
            'decor.bio': bio,
            ...(iconId ? { 'decor.icon': iconId } : {}),
        });

        res.status(200).json({ icon: iconId });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send("Error updating profile");
    }
};

const deleteUser = async(req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username }).populate('posts').populate('comments');

        const posts = user.posts;
        const comments = user.comments;

        let i;
        for (i = 0; i < posts.length; i++) {
            const req = {
                body: {
                    postId: posts[i].postId,
                    authorName: user.credentials.username
                }
            };

            const res = await serverDeletePost(req);
            if (!res.success) {
                console.error('Failed to delete post: ', res.error);
            }
        }

        for (i = 0; i < comments.length; i++) {
            const req = {
                body: {
                    commentId: comments[i].commentId,
                    authorName: user.credentials.username
                }
            };

            const res = await serverDeleteComment(req);
            if (!res.success) {
                console.error('Failed to delete comment: ', res.error);
            }
        }

        user.credentials.username = `[deleted]_${user._id}`; // to bypass unique requirement
        user.credentials.passwordSalt = null;
        user.credentials.passwordHash = null;

        user.decor.icon = new mongoose.Types.ObjectId('67caf0890c6cb1c003672e7c');
        user.decor.bio = null;

        user.deleted = true;

        await user.save();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

const serverGetUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        const userInfo = {
            username: user.credentials.username,
            icon: user.decor.icon
        };
        return { success: true, userInfo };
    } catch (error) {
        console.log('Error in getting user (server side): ', error);
        return { success: false };
    }
};

const getUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await serverGetUser(userId);
        if (result.success) res.status(200).json({ userInfo: result.userInfo });
        else res.status(500).json({ message: 'Error in getting user: ' });
    } catch (error) {
        console.log('Error in getting user (client side): ', error);
        res.status(500).json({ message: 'Error in getting user: ', error });
    }
};

module.exports = { deleteFile, editUser, deleteUser, serverGetUser, getUser };