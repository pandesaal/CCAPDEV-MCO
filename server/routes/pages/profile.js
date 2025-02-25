const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const user = await getUserData(req.params.username);
    await page_renderer('profile', req, res, { user, posts: user.posts });
};

module.exports = profile;
