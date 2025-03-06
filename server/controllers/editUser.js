const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const postModule = require('./createPost');

const uploadImage = async(req, res) => {
};

const editUser = async(req, res) => {
};

const deleteUser = async(req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username }).populate('posts');

        const posts = user.posts;

        let i;
        for (i = 0; i < posts.length; i++) {
            const req = {
                body: {
                    postId: posts[i].postId,
                    authorName: user.credentials.username
                }
            };

            const res = await postModule.serverDeletePost(req);
            if (!res.success) {
                console.error('Failed to delete post: ', res.error);
            }
        }

        // insert deleting comments here

        user.credentials.username = `[deleted]_${user._id}`; // to bypass unique requirement
        user.credentials.passwordSalt = null;
        user.credentials.passwordHash = null;

        user.decor.icon = '../../assets/defaulticon.png';
        user.decor.bio = null;

        user.deleted = true;

        await user.save();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = { uploadImage, editUser, deleteUser };