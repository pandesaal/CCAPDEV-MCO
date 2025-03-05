const page_renderer = async (view, req, res, data = {}) => {
    try {
        const { user = null, posts = [], searchTypes = {}, totalPages = 1 } = data;

        let page = parseInt(req.query.page) || 1;

        res.render(view, {
            layout: false,
            user,
            posts,
            title: req.query.q ? `"${req.query.q}"` :
                    req.query.tag ? `"${req.query.tag}"` :
                    req.params.username ? `"${req.params.username}"` :
                    "Search",
            searchTypes,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error("Error loading template:", err);
        res.status(404).render('404', {layout: false});
    }
};

module.exports = page_renderer;
