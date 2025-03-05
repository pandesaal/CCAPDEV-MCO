const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const user = await getUserData( { username: req.params.username, exactMatch: true });
    // console.log('obtained users: \n', user.users[0]);
    await page_renderer('profile', req, res, { user: user.users[0], posts: user.users[0].posts, comments: user.users[0].comments });
};

module.exports = profile;
