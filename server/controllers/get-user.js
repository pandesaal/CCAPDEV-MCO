const User = require('../models/User');

const getUserData = async ({ username = null, exactMatch = false, page = 1, limit = 15 } = {}) => {
    const filters = username 
        ? { 'credentials.username': exactMatch ? username : { $regex: username, $options: 'i' } } 
        : {};

    try {
        const query = User.find(filters)
            .select('credentials.username decor.bio decor.icon posts comments')
            .populate({
                path: 'posts',
                match: { deleted: false },
                populate: {
                    path: 'author',
                    select: 'credentials.username decor.icon'
                }
            })
            .populate({
                path: 'comments',
                match: { deleted: false },
                populate: {
                    path: 'author',
                    select: 'credentials.username decor.icon'
                }
            })
            .skip((page - 1) * limit)
            .limit(limit);

        const users = await query.lean();
        const totalCount = await User.countDocuments(filters);
        
        return { 
            users: users.map(user => ({
                        ...user,
                        posts: user.posts.map(post => ({
                            ...post,
                            datePosted: new Date(post.datePosted).toISOString().split('T')[0],
                            dateEdited: new Date(post.dateEdited).toISOString().split('T')[0],
                        })),
                        comments: user.comments.map(comment => ({
                            ...comment,
                            datePosted: new Date(comment.datePosted).toISOString().split('T')[0],
                            dateEdited: new Date(comment.dateEdited).toISOString().split('T')[0]
                        }))
                    })), 
            totalPages: Math.ceil(totalCount / limit), 
            currentPage: page 
        };
    } catch (error) {
        console.error(error);
        return { users: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = getUserData;