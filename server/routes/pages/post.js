const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const post = async (req, res) => {
    const postObject = await getPostData({postId: req.params.id, comments: true})
    const post = postObject.posts[0]
    
    if (post)
        page_renderer('post', req, res, {posts: post});
    else
        res.status(404).render('404', {layout: false});
}

module.exports = post;