const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const checkCommentAccess = async (req, res) => {    
    const { currentUserName, authorId } = req.body;
    
    try {
        console.log('Received comment data:', { currentUserName, authorId });
        const user = await User.findOne({ 'credentials.username': currentUserName });
        if (!user) {
            return res.json(false); // Return false if user not found
        }
        
        const author = await User.findOne({ _id: authorId });
        if (!author) {
            return res.json(false); // Return false if author not found
        }

        if (user._id.toString() !== author._id.toString()) {
            return res.json(false); // Return false if the user is not the same as the author
        }

        return res.json(true); // Return true if user has access
    } catch (error) {
        console.error(error);
        return res.json(false); // Return false in case of any error
    }
};

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
            return res.status(404).json({ message: "Post not found." });
        }

        const newComment = new Comment({
            author: user._id, 
            replyTo: post._id,
            replyToRefPath: replyToRefPath,
            content: content
        });

        await newComment.save();

        await User.findByIdAndUpdate(user._id, {
            $push: { comments: newComment._id }
        });

        await Post.findByIdAndUpdate(post._id, {
            $push: { comments: newComment._id }
        });

        res.status(201).json({ message: 'Comment created successfully.', comment: newComment});
    } catch (error) {
        res.status(500).json({ message: 'Error uploading a comment.', error });
    }
};

const editComment = async (req, res) => {
    const { authorName, postId, commentId, content } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const comment = await Comment.findOne({ commentId });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        if (comment.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this comment." });
        }

        comment.content = content;
        comment.dateEdited = new Date();

        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully.', post });
    } catch (error) {
        res.status(500).json({ message: 'Error editing the comment.', error });
    }
};

const deleteComment = async (req, res) => {
    const { commentId, postId, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You are not currently logged in. Please log in to access this feature." });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        if (comment.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this Comment." });
        }

        // user.comments.pull(comment._id);
        // await user.save();
        await User.findByIdAndUpdate(user._id, {
            $pull: { comments: comment._id }
        });
        await Post.findByIdAndUpdate(post._id, {
            $pull: { comments: comment._id }
        });
        comment.content = '[deleted]';
        comment.deleted = true;
        await comment.save();

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the Comment.', error });
    }
};

module.exports = { checkCommentAccess, createComment, editComment, deleteComment };
