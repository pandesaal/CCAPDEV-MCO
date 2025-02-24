const Post = require('../models/Post');
const User = require('../models/User');

const getPostData = async ({ userId, postId, search, comments = false } = {}) => {
    const filters = {};
    
    try {
        
        if (userId) {
            const user = await User.findOne({ credentials: userId }).lean();
            if (user) {
                filters.author = user._id;
            }
        }

        
        if (postId) {
            filters._id = postId;
        }

        
        if (search?.tag) {
            filters.tags = { $in: Array.isArray(search.tag) ? search.tag : [search.tag] };
        }

        
        if (search?.q) {
            filters.$or = [
                { title: { $regex: search.q, $options: 'i' } },
                { content: { $regex: search.q, $options: 'i' } }
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
