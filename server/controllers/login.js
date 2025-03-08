const User = require('../models/User');
const { serverGetUser } = require('./user');

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

        // user info for nav
        const response = await serverGetUser(user._id);

        req.session.userid = user._id;
        req.session.remember = false;
        if (rememberMe) req.session.remember = true;

        res.status(200).json({ message: 'Login successful', user: response.userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: 'Session destroyed' });
    } catch (err) {
        console.error('Error destroying session: ', err);
        res.status(500).json({ error: err });
    }
};

const checkSession = async (req, res) => {
    try {
        if (req.session && req.session.userid && req.session.remember) {
            req.session.cookie.maxAge = 1.814e9;
            req.session.save();
            const response = await serverGetUser(req.session.userid);
            res.status(200).json({ active: true, userInfo: response.userInfo });
        }
        else res.status(200).json({ active: false });
    } catch (error) {
        console.error('Error checking session: ', error);
        res.status(500).json({ error });
    }
};

module.exports = { loginUser, logoutUser, checkSession };