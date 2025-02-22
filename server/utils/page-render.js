const page_renderer = async (view, req, res, posts) => {
    try {
        res.render(view, {
            layout: false,
            posts
        });
    } catch (err) {
        console.error("Error loading post template:", err);
        res.status(500).send("Error loading page");
    }
};

module.exports = page_renderer;