const User = require('../models/User');

const signupUser = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ 'credentials.username': username });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match. Please ensure both fields are identical.' });
        }

        const newUser = new User({
            credentials: {
                username: username,
                passwordSalt: password,
                passwordHash: password
            }
        });
        await newUser.save();
        
        // user info for nav
        const userInfo = {
            username: newUser.credentials.username,
            icon: newUser.decor.icon
        };

        res.status(201).json({ message: 'User registered successfully', user: userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

module.exports = { signupUser };