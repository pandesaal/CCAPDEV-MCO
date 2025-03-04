const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const home = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;

    const { posts, totalPages } = await getPostData({ 
        page, 
        limit 
    });

    await page_renderer('home', req, res, { posts, page, totalPages });

};

module.exports = home;
