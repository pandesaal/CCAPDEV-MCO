const User = require('../models/User');
const { contentFilterMatcher } = require('../utils/content-filtering');
const { generateSalt, hashPassword } = require('../utils/hasher');

const signupUser = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    try {
        if (contentFilterMatcher.hasMatch(username) || contentFilterMatcher.hasMatch(password)) {
            throw new Error('Profanity found in signup credentials.');
        }

        const existingUser = await User.findOne({ 'credentials.username': username });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match. Please ensure both fields are identical.' });
        }

        const salt = generateSalt();
        const newUser = new User({
            credentials: {
                username: username,
                passwordSalt: salt,
                passwordHash: hashPassword(password, salt)
            }
        });
        await newUser.save();
        
        const user = await User.findOne({ 'credentials.username': username });
        req.session.userid = user._id;
        req.session.remember = false;

        // user info for nav
        const userInfo = {
            username: newUser.credentials.username,
            icon: newUser.decor.icon
        };

        res.status(201).json({ message: 'User registered successfully!', user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { signupUser };