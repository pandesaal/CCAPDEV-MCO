const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    credentials: {
        username: {type: String, required: true, unique: true},
        passwordSalt: {type: String, required: function () { return !this.deleted; }},
        passwordHash: {type: String, required: function () { return !this.deleted; }}
    },
    decor : {
        bio: {type: String, default: 'This is your bio!'},
        icon: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('67caf0890c6cb1c003672e7c') }
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    deleted: { type: Boolean, default: false }
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;