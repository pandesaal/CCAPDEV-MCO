const page_renderer = async (view, req, res, posts) => {
    try {
        res.render(view, {
            layout: false,
            posts,
            title: `"${req.query.q}"` || `"${req.params.username}"` || "Search"
        });
    } catch (err) {
        console.error("Error loading post template:", err);
        res.status(500).send("Error loading page");
    }
};

module.exports = page_renderer;