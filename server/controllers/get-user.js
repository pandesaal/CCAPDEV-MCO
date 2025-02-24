const User = require('../models/User');

const getUserData = async (username) => {

    try {
        const user = await User.findOne({ 'credentials.username': username })
                        .select('-credentials.passwordSalt -credentials.passwordHash').populate('posts').lean();
        return user;
    } catch (error) {
        console.error(error);
    }
};

module.exports = getUserData;