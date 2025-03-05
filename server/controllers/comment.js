const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createComment = async (req, res) => {    
    const { authorName, postId, replyToRefPath, content } = req.body;
    
    try {
        console.log('Received comment data:', { authorName, postId, replyToRefPath, content });
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = new Comment({
            author: user._id, 
            replyTo: post._id,
            replyToRefPath: replyToRefPath,
            content: content
        });

        user.comments.push(newComment._id);
        post.comments.push(newComment._id);

        await newComment.save();
        await post.save();

        res.status(201).json({ message: 'Comment created successfully', comment: newComment});
    } catch (error) {
        res.status(500).json({ message: 'Error uploading a comment.', error });
    }
};

const editComment = async (req, res) => {
    const { postId, title, content, contentShort, tags, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
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

const deleteComment = async (req, res) => {
    const { postId, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
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

module.exports = { createComment, editComment, deleteComment };
