const User = require('../models/User');

const loginUser = async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        
        if (!user) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }

        if ((user.credentials.passwordSalt !== password) && (user.credentials.passwordHash !== password)) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const userInfo = {
            username: user.credentials.username,
            icon: user.decor.icon,
            bio: user.decor.bio
        };

        if (rememberMe) {
            // extend session by 3 weeks
        }
        res.status(200).json({ message: 'Login successful', user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser };