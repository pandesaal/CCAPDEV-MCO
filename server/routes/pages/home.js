const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');
const User = require('../../models/User');

const home = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;

    let user = null;
    if (req.session && req.session.userid) {
        try {
            user = await User.findById(req.session.userid).lean();
        } catch (error) {
            console.error('Error retrieving user: ', error);
        }
    }

    const { posts, totalPages } = await getPostData({
        user, 
        page, 
        limit,
        comments: true 
    });

    await page_renderer('home', req, res, { posts, page, totalPages });
};

module.exports = home;
