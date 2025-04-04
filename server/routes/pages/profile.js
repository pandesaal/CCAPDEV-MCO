const { getRootPost } = require('../../controllers/get-comments');
const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const {type, page = 1} = req.query;

    let userId = null;
    if (req.session && req.session.userid) userId = req.session.userid;

    const {users} = await getUserData( { userId, username: req.params.username, exactMatch: true });

    let searchTypes = {}
    let content, totalContent, limit = 5;

    const user = users[0];

    if (!user) {
        return res.status(404).render('404', {layout: false});
    }

    if (type === "posts") {
        searchTypes.isPost = true;

        totalContent = user.posts.length;
        if (totalContent < 1) totalContent = 1; 
        content = user.posts.slice((page - 1) * limit, page * limit);
    } else if (type === 'comments') {
        searchTypes.isComment = true;

        totalContent = user.comments.length;
        if (totalContent < 1) totalContent = 1; 
        content = await Promise.all(
            user.comments
                .slice((page - 1) * limit, page * limit)
                .map(async comment => ({
                    ...comment,
                    rootPost: await getRootPost(comment), //for attaching the root post of the comment to link back to the post
                }))
        );
    } else {
        res.redirect(`/user/${req.params.username}?type=posts`);
    }

    await page_renderer('profile', req, res, { user: user, posts: content, searchTypes: searchTypes, totalPages: Math.ceil(totalContent / limit) });
};

module.exports = profile;
