const Post = require('../models/Post');
const User = require('../models/User');

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
                populate: {
                    path: 'author',
                    select: 'credentials.username decor.icon'
                }
            });
        }

        const posts = await query.lean();

        return posts.map(post => ({
            ...post,
            datePosted: new Date(post.datePosted).toLocaleString('en-US', { timeZone: 'UTC' }),
            dateEdited: new Date(post.dateEdited).toLocaleString('en-US', { timeZone: 'UTC' })
        }));

    } catch (error) {
        console.error(error);
        return [];
    }
};

module.exports = getPostData;
