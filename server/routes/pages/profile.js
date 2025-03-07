const { getRootPost } = require('../../controllers/get-comments');
const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    console.log('profile called: ', req.params.username);
    const {users} = await getUserData( { username: req.params.username, exactMatch: true });

    const user = users[0];
    console.log(user);

    user.comments = await Promise.all(user.comments.map(async comment => ({
        ...comment,
        rootPost: await getRootPost(comment)
    }))); //for attaching the root post of the comment to link back to the post

    await page_renderer('profile', req, res, { user: user, posts: user.posts, comments: user.comments });
};

module.exports = profile;
