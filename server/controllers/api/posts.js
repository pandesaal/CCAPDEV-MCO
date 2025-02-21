const Post = require('../../models/Post');

const getPostData = async (req, res) => {

    try {
        const posts = await Post.find()
            .populate('author', 'credentials.username decor.icon')
            .lean();

            const formattedPosts = posts.map(post => ({
                ...post,
                datePosted: new Date(post.datePosted).toLocaleString('en-US', { timeZone: 'UTC' }),
                dateEdited: new Date(post.dateEdited).toLocaleString('en-US', { timeZone: 'UTC' })
            }));

        res.json(formattedPosts)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading posts");
    }
};

module.exports = getPostData;