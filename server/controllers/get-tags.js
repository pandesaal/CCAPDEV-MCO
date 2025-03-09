const Post = require('../models/Post');

const getTags = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        let posts = await Post.find({ deleted: { $ne: true } }, 'tags datePosted').lean();

        let tagData = {};

        posts.forEach(post => {
            post.tags.forEach(tag => {
                if (!tagData[tag]) {
                    tagData[tag] = { count: 0, latestPostDate: null };
                }

                tagData[tag].count += 1;

                if (!tagData[tag].latestPostDate || post.datePosted > tagData[tag].latestPostDate) {
                    tagData[tag].latestPostDate = post.datePosted;
                }
            });
        });

        if (searchQuery) {
            tagData = Object.fromEntries(
                Object.entries(tagData).filter(([tag]) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
        
        for (const tag in tagData) {
            if (tagData[tag].latestPostDate) {
                tagData[tag].latestPostDate = new Date(tagData[tag].latestPostDate).toISOString().replace('T', ' ').slice(0, 16);
            }
        }

        res.json(tagData);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tags" });
    }
};

module.exports = getTags;
