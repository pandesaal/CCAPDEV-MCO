const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    datePosted: {type: Date, required: true, default: () => Date.now()},
    dateEdited: {type: Date, required: true, default: () => Date.now()},
    replyTo: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'replyToRefPath' },
    replyToRefPath: { type: String, required: true, enum: ['Post', 'Comment'] },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {collection: 'Comments'});

postSchema.virtual('likeCount').get(() => {
    return this.likes.length;
});

postSchema.virtual('dislikeCount').get(() => {
    return this.dislikes.length;
});

postSchema.virtual('commentCount').get(() => {
    return this.comments.length;
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;