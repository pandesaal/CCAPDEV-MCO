const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {    
    const { authorName, title, content, contentShort, tags} = req.body;
    
    try {
        console.log('Received post data:', { authorName, title, content, contentShort, tags });
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPost = new Post({
            author: user._id, 
            title: title.trim(),
            content: content.trim(),
            contentShort: contentShort.trim(),
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : []
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost});
    } catch (error) {
        res.status(500).json({ message: 'Error uploading a post.', error });
    }
};

module.exports = { createPost };
