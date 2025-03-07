const { getRootPost } = require('../../controllers/get-comments');
const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const profile = async (req, res) => {
    const {users} = await getUserData( { username: req.params.username, exactMatch: true });

    const user = users[0];
    console.log(user);
    const posts = user.posts.map(post => ({
        ...post,
        author: user
    }));
    user.comments = await Promise.all(user.comments.map(async comment => ({
        ...comment,
        rootPost: await getRootPost(comment)
    }))); //for attaching the root post of the comment to link back to the post
    const comments = user.comments.map(comment => ({
        ...comment,
        author: user
    }));

    await page_renderer('profile', req, res, { user: user, posts: posts, comments: comments });
};

module.exports = profile;
