const User = require('../../models/User');

const getUserData = async (req, res) => {

    try {
        const user = User.find().populate().lean('posts');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading user");
    }
};

module.exports = getUserData;