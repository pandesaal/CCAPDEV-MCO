const Post = require('../models/Post');

const getTags = async (req, res) => {
    try {
        const { searchQuery } = req.body;
        let posts = await Post.find({}, 'tags').lean();
        let tags = posts.flatMap(post => post.tags);

        if (searchQuery) {
            tags = tags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tags" });
    }
};

module.exports = getTags;
