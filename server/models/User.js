const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    credentials: {
        username: {type: String, required: true, unique: true},
        passwordSalt: {type: String, required: true},
        passwordHash: {type: String, required: true}
    },
    decor : {
        bio: {type: String},
        icon: {type: String, default: '../../client/assets/defaulticon.png'}
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;