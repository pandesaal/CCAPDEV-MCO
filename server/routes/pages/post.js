const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const post = async (req, res) => {
    const post = await getPostData({postId: req.params.id, comments: true})
    if (post[0])
        page_renderer('post', req, res, {posts: post[0]});
    else
        res.status(404).render('404', {layout: false});
}

module.exports = post;