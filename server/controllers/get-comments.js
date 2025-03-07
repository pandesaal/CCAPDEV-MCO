const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getRootPost = async (comment) => {
    let currentComment = comment;

    while (currentComment && currentComment.replyToRefPath === 'Comment') {
        currentComment = await Comment.findById(currentComment.replyTo)
            .select('replyTo replyToRefPath')
            .lean();
    }

    if (currentComment && currentComment.replyToRefPath === 'Post') {
        return await Post.findById(currentComment.replyTo).lean();
    }

    return null;
};

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

        return { 
            comments: comments.map(comment => ({
                ...comment,
                datePosted: new Date(comment.datePosted).toISOString().split('T')[0],
                dateEdited: new Date(comment.dateEdited).toISOString().split('T')[0]
            })), 
            totalPages: Math.ceil(totalCount / limit), 
            currentPage: page 
        };
    } catch (error) {
        console.error(error);
        return { comments: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = {getCommentsData, getRootPost};
