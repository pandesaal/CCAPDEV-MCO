const Post = require('../models/Post');

const getPostData = async ({postId, search, comments = false } = {}) => {
    const filters = {};
    
    try {

        if (postId) {
            filters.postId = postId;
        }

        if (search?.get('tag')) {
            filters.tags = { $in: [search.get('tag')] };
        }        
        
        if (search?.get('q')) {
            filters.$or = [
                { title: { $regex: search.get('q'), $options: 'i' } },
                { content: { $regex: search.get('q'), $options: 'i' } }
            ];
        }

        
        let query = Post.find(filters)
            .populate('author', 'credentials.username decor.icon')
            .sort({ datePosted: -1 });

            
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

        return posts.map(post => ({
            ...post,
            datePosted: new Date(post.datePosted).toISOString().split('T')[0],
            dateEdited: new Date(post.dateEdited).toISOString().split('T')[0],
            comments: comments
                ? post.comments?.map(comment => ({
                    ...comment,
                    datePosted: new Date(comment.datePosted).toISOString().split('T')[0],
                    dateEdited: new Date(comment.dateEdited).toISOString().split('T')[0]
                }))
                : undefined
        }));
        
    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = getPostData;
