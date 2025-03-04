const Comment = require('../models/Comment');

const getCommentsData = async ({ postId = null, search = null, page = 1, limit = 15 } = {}) => {
    const filters = postId ? { replyTo: postId } : {};

    if (search) {
        filters.content = { $regex: search.get('q'), $options: 'i' };
    }

    try {
        const query = Comment.find(filters)
            .populate('author', 'credentials.username decor.icon')
            .sort({ datePosted: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const comments = await query.lean();
        const totalCount = await Comment.countDocuments(filters);

        return { comments, totalPages: Math.ceil(totalCount / limit), currentPage: page };
    } catch (error) {
        console.error(error);
        return { comments: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = getCommentsData;
