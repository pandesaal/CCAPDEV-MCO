const Post = require('../models/Post');

function isValidDate(date) {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

const getPostData = async ({ user = null, postId, search, comments = false, page = 1, limit = 15, deleted = false } = {}) => {
    const filters = {};

    if (!deleted) filters.deleted = deleted;

    if (postId) filters.postId = postId;

    if (search?.get('tag')) {
        filters.tags = { $in: [search.get('tag')] };
    }        
        
    if (search?.get('q')) {
        filters.$or = [
            { title: { $regex: search.get('q'), $options: 'i' } },
            { content: { $regex: search.get('q'), $options: 'i' } }
        ];
    }

    try {
        let query = Post.find(filters)
            .populate('author', 'credentials.username decor.icon')
            .sort({ datePosted: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        if (comments) {
            query = query.populate({
                path: 'comments',
                options: { sort: { datePosted: -1 } },
                populate: {
                    path: 'author',
                    select: 'credentials.username decor.icon'
                }
            });
        }

        const posts = await query.lean();
        const totalCount = await Post.countDocuments(filters);

        // previous code; encountered error from this (RangeError: Invalid time value at Date.toISOString)
        // return {
        //     posts: posts.map(post => ({
        //         ...post,
        //         datePosted: new Date(post.datePosted).toISOString().split('T')[0],
        //         dateEdited: new Date(post.dateEdited).toISOString().split('T')[0],
        //         comments: comments
        //         ? post.comments?.map(comment => ({
        //             ...comment,
        //             datePosted: new Date(comment.datePosted).toISOString().split('T')[0],
        //             dateEdited: new Date(comment.dateEdited).toISOString().split('T')[0]
        //         }))
        //         : post.comments
        //     })),
        //     totalPages: Math.ceil(totalCount / limit),
        //     currentPage: page
        // };

        return {
            posts: posts.map(post => ({
                ...post,
                isAuthor: user && (post.author.credentials.username === user.credentials.username),
                datePosted: isValidDate(post.datePosted) ? new Date(post.datePosted).toISOString().replace('T', ' ').slice(0, 16) : null,
                dateEdited: isValidDate(post.dateEdited) ? new Date(post.dateEdited).toISOString().replace('T', ' ').slice(0, 16) : null,
                comments: comments
                    ? post.comments?.map(comment => ({
                        ...comment,
                        isAuthor: user && (comment.author.credentials.username === user.credentials.username),
                        datePosted: isValidDate(comment.datePosted) ? new Date(comment.datePosted).toISOString().replace('T', ' ').slice(0, 16) : null,
                        dateEdited: isValidDate(comment.dateEdited) ? new Date(comment.dateEdited).toISOString().replace('T', ' ').slice(0, 16) : null
                    }))
                    : post.comments
            })),
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        };
        
    } catch (error) {
        console.error(error);
        return { posts: [], totalPages: 1, currentPage: 1 };
    }
};

module.exports = getPostData;
