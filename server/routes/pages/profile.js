const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const user = await getUserData(req.params.username, true);
    await page_renderer('profile', req, res, { user: user[0], posts: user.posts });
};

module.exports = profile;
