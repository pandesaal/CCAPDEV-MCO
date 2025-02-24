const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');

const post = async (req, res) => {
    const post = await getPostData({postId: req.params.id, comments: true})

    console.log("Posts Data:", JSON.stringify(post, null, 2));

    page_renderer('post', req, res, { posts: post[0] });
}

module.exports = post;