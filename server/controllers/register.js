const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ 'credentials.username': username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const passwordSalt = password /* change this */;
        const passwordHash = password /* change this */;

        const newUser = new User({
            credentials: {
                username: username,
                passwordSalt: passwordSalt,
                passwordHash: passwordHash
            }
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };