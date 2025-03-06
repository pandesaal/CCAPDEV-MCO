const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    console.log('profile called: ', req.params.username);
    const user = await getUserData( { username: req.params.username, exactMatch: true });
    console.log(user);
    await page_renderer('profile', req, res, { user: user.users[0], posts: user.users[0].posts, comments: user.users[0].comments });
};

module.exports = profile;
