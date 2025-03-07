const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const user = await getUserData( { username: req.params.username, exactMatch: true });
    const posts = user.users[0].posts.map(post => ({
        ...post,
        author: user.users[0]
    }));
    const comments = user.users[0].comments.map(comment => ({
        ...comment,
        author: user.users[0]
    }));
    await page_renderer('profile', req, res, { user: user.users[0], posts: posts, comments: comments });
};

module.exports = profile;
