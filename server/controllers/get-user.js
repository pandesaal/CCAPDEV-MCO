const User = require('../models/User');

const getUserData = async ({ username = null, exactMatch = false, page = 1, limit = 15 } = {}) => {
    const filters = username 
        ? { 'credentials.username': exactMatch ? username : { $regex: username, $options: 'i' } } 
        : {};

    try {
        const query = User.find(filters)
            .select('credentials.username decor.bio decor.icon')
            .skip((page - 1) * limit)
            .limit(limit);

        const users = await query.lean();
        const totalCount = await User.countDocuments(filters);

        return { users, totalPages: Math.ceil(totalCount / limit), currentPage: page };
    } catch (error) {
        console.error(error);
        return { users: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = getUserData;