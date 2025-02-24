const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const post = async (req, res) => {
    const post = await getPostData({postId: req.params.id, comments: true})
    page_renderer('post', req, res, post[0]);
}

module.exports = post;