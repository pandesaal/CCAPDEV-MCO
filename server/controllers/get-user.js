const User = require('../models/User');

const getUserData = async (username = null, exactMatch = false) => {

    const filters = {};
    try {

        if (username) {
            filters['credentials.username'] = { $regex: username, $options: 'i' }

            if (exactMatch) {
                filters['credentials.username'] = { $regex: `^${username}$`, $options: 'i' };
            }
        }

        const user = await User.find(filters)
                        .select('-credentials.passwordSalt -credentials.passwordHash').populate('posts').lean();
        return user;
    } catch (error) {
        console.error(error);
    }
};

module.exports = getUserData;