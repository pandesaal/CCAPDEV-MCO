const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const autopopulate = require('../utils/autopopulate');

const postSchema = new mongoose.Schema({
    postId: {type: String, unique: true, default: uuidv4},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    datePosted: {type: Date, required: true, default: () => Date.now()},
    dateEdited: {type: Date},
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: [{type: String}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    deleted: { type: Boolean, default: false }
},{collection: 'Posts'});

postSchema.virtual('likeCount').get(() => {
    return this.likes.length;
});

postSchema.virtual('dislikeCount').get(() => {
    return this.dislikes.length;
});

postSchema.virtual('commentCount').get(() => {
    return this.comments.length;
});

postSchema.pre('findOne', autopopulate('author')).pre('find', autopopulate('author'));

const Post = mongoose.model('Post', postSchema);

module.exports = Post;