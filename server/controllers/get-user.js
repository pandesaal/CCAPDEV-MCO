const User = require('../models/User');

const getUserData = async () => {

    try {
        const user = User.find().populate('posts').lean();
        return user;
    } catch (error) {
        console.error(error);
    }
};

module.exports = getUserData;