const getPostData = require('../../controllers/get-post');
const getUserData = require('../../controllers/get-user');
const page_renderer = require('../../utils/page-render');

const search = async (req, res) => {
    // console.log('routes/pages/search.js: DO NOT FORGET TO CHANGE BACK TO HOME')
    // const posts = await getUserData();
    // await page_renderer('demo', req, res, { posts: posts });

    const searchParams = new URLSearchParams(req.query);
    if (searchParams.type && !searchParams.q) {
        res.redirect('/');
    }

    if (!searchParams.type && searchParams.q) {
        searchParams.set('type', 'posts');
        res.redirect(`/search?${searchParams.toString()}`);
    }

    const posts = await getPostData({search: searchParams});
    await page_renderer('search', req, res, { posts: posts });
};

module.exports = search;
