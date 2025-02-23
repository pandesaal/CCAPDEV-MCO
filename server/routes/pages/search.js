const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const search = async (req, res) => {
    const posts = await getPostData({});
    await page_renderer('search', req, res, posts);
};

module.exports = search;
