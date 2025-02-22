const Post = require('../models/Post');
const User = require('../models/User');

const getPostData = async ({userId, postId, tags, comments = false} = {}) => {

    const filters = {}
    try {
        if (userId) {
            const user = User.findOne({credentials: userId}).lean()

            if (user) {
                filters.author = user._id;
            }
        }

        if (postId) {
            filters.postId = postId;
        }

        if (tags) {
            filters.tags = tags;
        }


        let query = Post.find(filters)
            .populate('author', 'credentials.username decor.icon')
            .sort({datePosted: -1});

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
    }
};

module.exports = getPostData;