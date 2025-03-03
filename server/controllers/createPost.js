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

const editPost = async (req, res) => {
    const { postId, title, content, contentShort, tags, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this post" });
        }

        post.title = title.trim();
        post.content = content.trim();
        post.contentShort = contentShort.trim();
        post.tags = Array.isArray(tags) ? tags.map(tag => tag.trim()) : [];
        post.dateEdited = new Date();

        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Error editing the post', error });
    }
};

const deletePost = async (req, res) => {
    const { postId, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "No user is currently logged in." });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post." });
        }

        await Post.deleteOne({ postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the post', error });
    }
};

module.exports = { createPost, editPost, deletePost };
