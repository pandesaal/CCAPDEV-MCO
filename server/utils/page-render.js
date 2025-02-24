const page_renderer = async (view, req, res, data = {}) => {
    try {
        const { user = null, posts = [] } = data;
        res.render(view, {
            layout: false,
            user,
            posts
        });
    } catch (err) {
        console.error("Error loading template:", err);
        res.status(500).send("Error loading page");
    }
};

module.exports = page_renderer;