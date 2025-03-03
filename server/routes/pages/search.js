const getPostData = require('../../controllers/get-post');
const getUserData = require('../../controllers/get-user');
const getCommentsData = require('../../controllers/get-comments');
const page_renderer = require('../../utils/page-render');

// search with tags, queries optional, search type auto posts, if not post then change to post
// search with queries required: post, tag, user, comment, if type present but no query, redirect to search
// if just /search: back to search
// anything else: 404

const search = async (req, res) => {

    const searchParams = new URLSearchParams(req.query);

    if ((searchParams.get('tag') && searchParams.get('type') !== 'posts') || (!searchParams.get('type') && searchParams.get('q'))) {
        searchParams.set('type', 'posts');
        console.log(searchParams)
        res.redirect(`/search?${searchParams.toString()}`);
        return;
    }

    if (!searchParams.get('q') && !searchParams.get('tag')) { //no query w no tag
        await page_renderer('search', req, res, {});
        return;
    }

    try {
        let response, content, type;
        response = await fetch('http://localhost:3000/api/tags');
        if (!response.ok) throw new Error("Failed to fetch content");
        const tags = await response.json();

        const [allUsers, allPosts, allComments] = await Promise.all([
            getUserData(),       
            getPostData(),       
            getCommentsData()    
        ]);
    
        const userCount = allUsers.filter(user => 
            user.credentials.username.toLowerCase().includes(searchParams.get('q').toLowerCase())
        ).length;

        const postCount = allPosts.filter(post => 
            post.title.toLowerCase().includes(searchParams.get('q').toLowerCase()) ||
            post.content.toLowerCase().includes(searchParams.get('q').toLowerCase())
        ).length;

        const commentCount = allComments.filter(comment => 
            comment.content.toLowerCase().includes(searchParams.get('q').toLowerCase())
        ).length;

        const tagCount = Object.entries(tags).filter(([key]) => key.includes(searchParams.get('q'))).length;
    
        const tagCounts = Object.fromEntries(
            Object.entries(
                allPosts.reduce((acc, post) => {
                    post.tags.forEach(tag => {
                        if (!acc[tag]) acc[tag] = { count: 0, latestPostDate: "0000-00-00" };
                        acc[tag].count += 1;
                        acc[tag].latestPostDate = post.datePosted > acc[tag].latestPostDate
                            ? post.datePosted
                            : acc[tag].latestPostDate;
                    });
                    return acc;
                }, {})
            ).sort((a, b) => b[1].count - a[1].count)
        );
    
        switch (searchParams.get('type')) {
            case 'users':
                content = allUsers.filter(user => 
                    user.credentials.username.toLowerCase().includes(searchParams.get('q').toLowerCase())
                );
                type = { isUser: true };
                break;
    
            case 'posts':
                content = allPosts.filter(post => {
                    const query = searchParams.get('q')?.toLowerCase();
                    const tagQuery = searchParams.get('tag')?.toLowerCase();
                
                    const matchesQuery = query 
                        ? post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query) 
                        : true; 
                
                    const matchesTag = tagQuery 
                        ? post.tags.some(tag => tag.toLowerCase().includes(tagQuery))
                        : true;
                
                    return matchesQuery && matchesTag;
                });
                
                type = { isPost: true };
                break;
    
            case 'comments':
                content = allComments.filter(comment => 
                    comment.content.toLowerCase().includes(searchParams.get('q').toLowerCase())
                );
                type = { isComment: true };
                break;
    
            case 'tags':
                // filter tags based on query
                content = Object.fromEntries(
                    Object.entries(tags).filter(([key]) => key.includes(searchParams.get('q')))
                );                
                type = { isTag: true };
                break;
    
            default:
                res.redirect('/search');
                return;
        }
        
        const searchTypes = {
            users: { count: userCount },
            posts: { count: postCount },
            comments: { count: commentCount },
            tags: { count: tagCount },
            tagCounts: tagCounts,
            type: type
        };
    
        await page_renderer('search-results', req, res, { posts: content, searchTypes: searchTypes });
        return;
    
    } catch (error) {
        console.error(error);
    }
    
};

module.exports = search;
