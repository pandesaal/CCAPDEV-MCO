const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const posts = await getPostData({});
    await page_renderer('profile', req, res, posts);
};

module.exports = profile;
