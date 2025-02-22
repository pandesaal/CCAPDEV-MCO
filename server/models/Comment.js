const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    datePosted: {type: Date, required: true, default: () => Date.now()},
    dateEdited: {type: Date, required: true, default: () => Date.now()},
    replyTo: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'replyToRefPath' },
    replyToRefPath: { type: String, required: true, enum: ['Post', 'Comment'] },
    content: { type: String, required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {collection: 'Comments'});

commentSchema.virtual('likeCount').get(() => {
    return this.likes.length;
});

commentSchema.virtual('dislikeCount').get(() => {
    return this.dislikes.length;
});

commentSchema.virtual('commentCount').get(() => {
    return this.comments.length;
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;