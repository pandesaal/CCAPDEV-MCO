const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createComment = async (req, res) => {    
    const { authorName, postId, replyToRefPath, content } = req.body;
    
    try {
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

        // Only update dateEdited if content changes
        if (comment.content !== content) {
            comment.content = content;
            comment.dateEdited = new Date();
        }

        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully.', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error editing the comment.', error });
    }
};

const serverDeleteComment = async (req) => {
    const { commentId, authorName } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            throw new Error('You are not currently logged in. Please log in to access this feature.');
        }

        const comment = await Comment.findOne({ commentId });
        if (!comment) {
            throw new Error('Comment not found.');
        }

        if (comment.author.toString() !== user._id.toString()) {
            throw new Error('Unauthorized to delete this Comment.');
        }

        comment.content = '[deleted]';
        comment.deleted = true;
        await comment.save();

        return { success: true };
    } catch (err) {
        console.log('Error in deleting comment (server side): ', err);
        return { success: false, error: err.message };
    }
};

const deleteComment = async (req, res) => {
    try {
        const result = await serverDeleteComment(req);
        if (result) res.status(200).json({ message: 'Comment deleted successfully' });
        else res.status(500).json({ message: 'Error in deleting comment: ', error });
    } catch (error) {
        console.log('Error in deleting comment (client side): ', error);
        res.status(500).json({ message: 'Error in deleting comment: ', error });
    }
};

const toggleLikeComment = async (req, res) => {
    const { commentId, authorName } = req.body;

    try {
        const comment = await Comment.findOne({ commentId });;
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to like a comment." });
        }

        const userId = user._id;
        const hasLiked = comment.likes.includes(userId);

        if (hasLiked) {
            await Comment.findByIdAndUpdate(comment._id, { $pull: { likes: userId } });
        } else {
            await Comment.findByIdAndUpdate(comment._id, { $push: { likes: userId }, $pull: { dislikes: userId } });
        }

        const updatedComment = await Comment.findOne({ commentId });

        return res.status(200).json({ 
            liked: !hasLiked, 
            likeCount: updatedComment.likes.length,
            dislikeCount: updatedComment.dislikes.length
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error });
    }
};

const toggleDisLikeComment = async (req, res) => {
    const { commentId, authorName } = req.body;

    try {
        const comment = await Comment.findOne({ commentId });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to dislike a Comment." });
        }

        const userId = user._id;
        const hasDisliked = comment.dislikes.includes(userId);

        if (hasDisliked) {
            await Comment.findByIdAndUpdate(comment._id, { $pull: { dislikes: userId } });
        } else {
            await Comment.findByIdAndUpdate(comment._id, { $push: { dislikes: userId }, $pull: { likes: userId } });
        }

        const updatedComment = await Comment.findOne({ commentId });

        return res.status(200).json({ 
            disliked: !hasDisliked, 
            dislikeCount: updatedComment.dislikes.length,
            likeCount: updatedComment.likes.length
        });

    } catch (error) {
        console.error("Error toggling dislike:", error);
        res.status(500).json({ message: "Error toggling dislike", error });
    }
};

const checkLikeCommentStatus = async (req, res) => {
    const { commentId, authorName } = req.query;

    try {
        const comment = await Comment.findOne({ commentId }).populate('comments', 'credentials.username');
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to like a comment." });
        }

        const hasLiked = comment.likes.some(likedUser => likedUser._id.equals(user._id));

        return res.status(200).json({ 
            liked: hasLiked
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error });
    }
};

const checkDislikeCommentStatus = async (req, res) => {
    const { commentId, authorName } = req.query;

    try {
        const comment = await Comment.findOne({ commentId }).populate('dislikes', 'credentials.username');
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const user = await User.findOne({ 'credentials.username': authorName });
        if (!user) {
            return res.status(404).json({ message: "You must be logged in to dislike a comment." });
        }

        const hasDisliked = comment.dislikes.some(dislikedUser => dislikedUser._id.equals(user._id));

        return res.status(200).json({ 
            disliked: hasDisliked,
            count: comment.dislikes.length
        });

    } catch (error) {
        console.error("Error toggling dislike:", error);
        res.status(500).json({ message: "Error toggling dislike", error });
    }
};

const checkIfEditedComment = async (req, res) => {
    const { commentId } = req.body;
    let hasEdited = false;
    let dateEdited = null;

    try {
        const comment = await Comment.findOne({ commentId });
        const edited = !!comment.dateEdited;
        if (comment) {
            if (edited){
                hasEdited = true;
                dateEdited = comment.dateEdited;
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

module.exports = { createComment, editComment, serverDeleteComment, deleteComment, toggleLikeComment, toggleDisLikeComment, checkLikeCommentStatus, checkDislikeCommentStatus, checkIfEditedComment };
