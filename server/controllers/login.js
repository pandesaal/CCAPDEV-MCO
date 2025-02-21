const User = require('../models/User');

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        if (!user) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }

        const isPasswordValid = true /* change this into compare function */;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser };