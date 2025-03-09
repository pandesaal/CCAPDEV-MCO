const User = require('../models/User');
const Post = require('../models/Post');

const createPost = async (req, res) => {    
    const { authorName, title, content, tags} = req.body;
    
    try {
        console.log('Received post data:', { authorName, title, content, tags });
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        const newPost = new Post({
            author: user._id, 
            title: title.trim(),
            content: content.trim(),
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : []
        });

        await newPost.save();
        await User.findByIdAndUpdate(user._id, {
            $push: { posts: newPost._id }
        });

        res.status(201).json({ message: 'Post created successfully', post: newPost});
    } catch (error) {
        res.status(500).json({ message: 'Error uploading a post.', error });
    }
};

const editPost = async (req, res) => {
    const { postId, title, content, tags, authorName } = req.body;

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
        post.tags = [];
        await post.save();

        return { success: true };

    } catch (error) {
        console.log('Error in deleting post (server side): ', error);
        return { success: false };
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

const toggleLike = async (req, res) => {
    const { postId, authorName } = req.body;

    try {
        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to like a post." });
        }

        const userId = user._id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            await Post.findByIdAndUpdate(post._id, { $pull: { likes: userId } });
        } else {
            await Post.findByIdAndUpdate(post._id, { $push: { likes: userId } });
        }

        const updatedPost = await Post.findOne({ postId });

        return res.status(200).json({ 
            liked: !hasLiked, 
            likeCount: updatedPost.likes.length 
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error });
    }
};

const toggleDislike = async (req, res) => {
    
};

const checkLikeStatus = async (req, res) => {
    const { postId, authorName } = req.query;

    try {
        const post = await Post.findOne({ postId }).populate('likes', 'credentials.username');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to like a post." });
        }

        const hasLiked = post.likes.some(likedUser => likedUser._id.equals(user._id));

        return res.status(200).json({ 
            liked: hasLiked
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error });
    }
};

const checkIfEditedPost = async (req, res) => {
    const { postId } = req.body;
    let hasEdited = false;

    try {
        const post = await Post.findOne({ postId });
        const edited = !!post.dateEdited;
        if (post) {
            if (edited){
                hasEdited = true;
                dateEdited = post.dateEdited;
            }
        }

        return res.status(200).json({ 
            edited: hasEdited,
            dateEdited: post.dateEdited || null
        });

    } catch (error) {
        console.error("Error showing edit status", error);
        res.status(500).json({ message: "Error showing edit status", error });
    }
};

module.exports = { createPost, editPost, serverDeletePost, deletePost, toggleLike, toggleDislike, checkLikeStatus, checkIfEditedPost };
