const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {    
    const { authorName, title, content, contentShort, tags} = req.body;
    
    try {
        console.log('Received post data:', { authorName, title, content, contentShort, tags });
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        const newPost = new Post({
            author: user._id, 
            title: title.trim(),
            content: content.trim(),
            contentShort: contentShort.trim(),
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : []
        });

        user.posts.push(newPost._id);
        await newPost.save();
        await user.save();

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

const serverDeletePost = async (req) => {
    const { postId, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            throw new Error('You are not currently logged in. Please log in to access this feature.');
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            throw new Error('Post not found.');
        }

        if (post.author.toString() !== user._id.toString()) {
            throw new Error('Unauthorized to delete this post.');
        }

        post.title = '[deleted]';
        post.content = '[deleted]';
        post.deleted = true;
        await post.save();

        user.posts.pull(post._id);
        await user.save();

        return { success: true };

    } catch (error) {
        console.log('Error in deleting post (server side): ', error);
        return { success: false, error: error.message };
    }
};

const deletePost = async (req, res) => {
    try {
        const result = await serverDeletePost(req);
        if (result) res.status(200).json({ message: 'Post deleted successfully' });
        else res.status(500).json({ message: 'Error in deleting post: ', error });
    } catch (error) {
        console.log('Error in deleting post (client side): ', error);
        res.status(500).json({ message: 'Error in deleting post: ', error });
    }
};

module.exports = { createPost, editPost, serverDeletePost, deletePost };
