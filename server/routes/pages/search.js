const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const search = async (req, res) => {
    const searchParams = req.query
    const posts = await getPostData({search: searchParams});
    await page_renderer('search', req, res, posts);
};

module.exports = search;
