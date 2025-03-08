const getPostData = require('../../controllers/get-post');
const page_renderer = require('../../utils/page-render');
const User = require('../../models/User');

const post = async (req, res) => {
    let deleted = false;
    if (req.get('Referer').includes('/user')) deleted = true;

    let user = null;
    if (req.session && req.session.userid) {
        try {
            user = await User.findById(req.session.userid).lean();
        } catch (error) {
            console.error('Error retrieving user: ', error);
        }
    }

    const postObject = await getPostData({ user, postId: req.params.id, comments: true, deleted: deleted })
    const post = postObject.posts[0]
    
    if (post)
        page_renderer('post', req, res, {posts: post});
    else
        res.status(404).render('404', {layout: false});
}

module.exports = post;