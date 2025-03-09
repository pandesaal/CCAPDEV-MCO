const User = require('../models/User');

function isValidDate(date) {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

const getUserData = async ({ userId = null, username = null, exactMatch = false, page = 1, limit = 15 } = {}) => {
    const filters = username 
        ? { 'credentials.username': exactMatch ? username : { $regex: username, $options: 'i' } } 
        : {};

    let loggedInUser;
    try {
        if (userId) loggedInUser = await User.findById(userId);
    } catch (error) {
        return console.error(error);
    }

    try {
        const query = User.find(filters)
            .select('credentials.username decor.bio decor.icon posts comments')
            .populate({
                path: 'posts',
                match: { deleted: false },
                options: { sort: { datePosted: -1 } },
                populate: {
                    path: 'author',
                    select: 'credentials.username decor.icon'
                }
            })
            .populate({
                path: 'comments',
                match: { deleted: false },
                options: { sort: { datePosted: -1 } },
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
                            isAuthor: loggedInUser && (post.author.credentials.username === loggedInUser.credentials.username),
                            datePosted: isValidDate(post.datePosted) ? new Date(post.datePosted).toISOString().split('T')[0] : null,
                            dateEdited: isValidDate(post.dateEdited) ? new Date(post.dateEdited).toISOString().split('T')[0] : null,
                        })),
                        comments: user.comments.map(comment => ({
                            ...comment,
                            isAuthor: loggedInUser && (comment.author.credentials.username === loggedInUser.credentials.username),
                            datePosted: isValidDate(comment.datePosted) ? new Date(comment.datePosted).toISOString().split('T')[0] : null,
                            dateEdited: isValidDate(comment.dateEdited) ? new Date(comment.dateEdited).toISOString().split('T')[0] : null,
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