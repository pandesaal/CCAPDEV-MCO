const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    datePosted: {type: Date, required: true, default: () => Date.now()},
    dateEdited: {type: Date, required: true, default: () => Date.now()},
    tags: [{type: String}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

postSchema.virtual('likeCount').get(() => {
    return this.likes.length;
});

postSchema.virtual('dislikeCount').get(() => {
    return this.dislikes.length;
});

postSchema.virtual('commentCount').get(() => {
    return this.comments.length;
});

const Post = mongoose.model('Post', postSchema);

export default Post;