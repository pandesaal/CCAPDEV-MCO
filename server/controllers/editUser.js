// still incomplete teka

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const editProfile = async(req, res) => {};

const deleteUser = async(req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });

        user.credentials.username = '[deleted]';
        user.credentials.passwordSalt = null;
        user.credentials.passwordHash = null;

        user.decor.icon = '../../assets/defaulticon.png';
        user.decor.bio = null;

        user.deleted = true;
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = {};