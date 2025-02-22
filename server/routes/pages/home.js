const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const home = async (req, res) => {
    const posts = await getPostData({});
    await page_renderer('home', req, res, posts);
};

module.exports = home;
