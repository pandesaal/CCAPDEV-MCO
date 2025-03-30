const Comment = require('../models/Comment');
const Post = require('../models/Post');

function isValidDate(date) {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

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
    else if (currentComment && currentComment.replyToRefPath === 'Comment') {
        return getRootPost(currentComment.replyTo).lean();
    }

    return null;
};

const getCommentsData = async ({ user = null, postId = null, search = null, page = 1, limit = 15 } = {}) => {
    const filters = postId ? { replyTo: postId } : {};

    if (search) {
        filters.content = { $regex: search.get('q'), $options: 'i' };
    }

    filters.deleted = false;

    try {
        const query = Comment.find(filters)
            .populate('author', 'credentials.username decor.icon', 'comments')
            .sort({ datePosted: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const comments = await query.lean();
        const totalCount = await Comment.countDocuments(filters);

        return { 
            comments: comments.map(comment => ({
                ...comment,
                isAuthor: user && (comment.author.credentials.username === user.credentials.username),
                datePosted: isValidDate(comment.datePosted) ? new Date(comment.datePosted).toISOString().replace('T', ' ').slice(0, 16) : null,
                dateEdited: isValidDate(comment.dateEdited) ? new Date(comment.dateEdited).toISOString().replace('T', ' ').slice(0, 16) : null,
                comments: comments
                    ? comment.comments?.map(comment => ({
                        ...comment,
                        isAuthor: user && (comment.author.credentials.username === user.credentials.username),
                        datePosted: isValidDate(comment.datePosted) ? new Date(comment.datePosted).toISOString().replace('T', ' ').slice(0, 16) : null,
                        dateEdited: isValidDate(comment.dateEdited) ? new Date(comment.dateEdited).toISOString().replace('T', ' ').slice(0, 16) : null
                    }))
                    : comment.comments
            })), 
            // comments: transformData(comments, user),
            totalPages: Math.ceil(totalCount / limit), 
            currentPage: page 
        };
    } catch (error) {
        console.error(error);
        return { comments: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = {getCommentsData, getRootPost};
