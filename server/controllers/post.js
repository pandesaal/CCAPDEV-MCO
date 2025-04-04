const User = require('../models/User');
const Post = require('../models/Post');
const { contentFilterMatcher } = require('../utils/content-filtering');

const getPostData = async (req, res) => {
    const { postId } = req.query;

    try {
        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const { title, content } = post;

        res.status(200).json({ message: "Post data received successfully.", title, content });
    } catch (error) {
        res.status(500).json({ message: 'Error getting the post data: ' + error.message });
    }
};

const createPost = async (req, res) => {    
    const { authorName, title, content, tags} = req.body;
    
    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        if (contentFilterMatcher.hasMatch(title) || contentFilterMatcher.hasMatch(content)) {
            throw new Error('Profanity found in post information.');
        }

        tags.forEach(tag => {
            if (contentFilterMatcher.hasMatch(tag)) {
                throw new Error('Profanity found in post information.');
            }
        });

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
        res.status(500).json({ message: 'Error uploading a post: ' + error.message });
    }
};

const editPost = async (req, res) => {
    const { postId, title, content, tags, authorName } = req.body;
    let message = "Post updated successfully.";
    let edited = false;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        if (contentFilterMatcher.hasMatch(title) || contentFilterMatcher.hasMatch(content)) {
            throw new Error('Profanity found in post information.');
        }

        tags.forEach(tag => {
            if (contentFilterMatcher.hasMatch(tag)) {
                throw new Error('Profanity found in post information.');
            }
        });

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this post" });
        }

        const trimmedTitle = title.trim();
        const trimmedSavedTitle = post.title.trim();
        const trimmedContent = content.trim();
        const trimmedSavedContent = post.content.trim();
        const newTags = Array.isArray(tags) ? tags.map(tag => tag.trim()) : [];
        const savedTags = post.tags.map(tag => tag.trim());

        const differentTitle = trimmedTitle !== trimmedSavedTitle;
        const differentContent = trimmedContent !== trimmedSavedContent;
        const sortedNewTags = [...newTags].sort();
        const sortedSavedTags = [...savedTags].sort();
        const differentTags = sortedNewTags.length !== sortedSavedTags.length || sortedNewTags.some((tag, index) => tag !== sortedSavedTags[index]);        

        // Only update if content is different after trimming
        if (differentTitle || differentContent || differentTags) {
            post.title = trimmedTitle;
            post.content = trimmedContent;
            post.tags = newTags;
            post.dateEdited = new Date();
            await post.save();
            edited = true;
        } else {
            message = "No changes made."
            edited = false;
        }
        res.status(200).json({ message, post, edited, differentTitle, differentContent, differentTags });
    } catch (error) {
        res.status(500).json({ message: 'Error editing the post: ' + error.message });
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

        if (post.author._id.toString() !== user._id.toString()) {
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
        const post = await Post.findOne({ postId });;
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
            await Post.findByIdAndUpdate(post._id, { $push: { likes: userId }, $pull: { dislikes: userId } });
        }

        const updatedPost = await Post.findOne({ postId });

        return res.status(200).json({ 
            liked: !hasLiked, 
            likeCount: updatedPost.likes.length,
            dislikeCount: updatedPost.dislikes.length
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error });
    }
};

const toggleDislike = async (req, res) => {
    const { postId, authorName } = req.body;

    try {
        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to dislike a post." });
        }

        const userId = user._id;
        const hasDisliked = post.dislikes.includes(userId);

        if (hasDisliked) {
            await Post.findByIdAndUpdate(post._id, { $pull: { dislikes: userId } });
        } else {
            await Post.findByIdAndUpdate(post._id, { $push: { dislikes: userId }, $pull: { likes: userId } });
        }

        const updatedPost = await Post.findOne({ postId });

        return res.status(200).json({ 
            disliked: !hasDisliked, 
            dislikeCount: updatedPost.dislikes.length,
            likeCount: updatedPost.likes.length
        });

    } catch (error) {
        console.error("Error toggling dislike:", error);
        res.status(500).json({ message: "Error toggling dislike", error });
    }
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

const checkDislikeStatus = async (req, res) => {
    const { postId, authorName } = req.query;

    try {
        const post = await Post.findOne({ postId }).populate('dislikes', 'credentials.username');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to dislike a post." });
        }

        const hasDisliked = post.dislikes.some(dislikedUser => dislikedUser._id.equals(user._id));

        return res.status(200).json({ 
            disliked: hasDisliked,
            count: post.dislikes.length
        });

    } catch (error) {
        console.error("Error toggling dislike:", error);
        res.status(500).json({ message: "Error toggling dislike", error });
    }
};

const checkIfEditedPost = async (req, res) => {
    const { postId } = req.body;
    let hasEdited = false;
    let dateEdited = null;

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
            dateEdited: dateEdited
        });

    } catch (error) {
        console.error("Error showing edit status", error);
        res.status(500).json({ message: "Error showing edit status", error });
    }
};

module.exports = { getPostData, createPost, editPost, serverDeletePost, deletePost, toggleLike, toggleDislike, checkLikeStatus, checkDislikeStatus, checkIfEditedPost };
