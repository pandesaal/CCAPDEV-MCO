const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const htmlFolder = path.join(__dirname, "../..", "client/html")
const pages = path.join(htmlFolder, "pages")

dotenv.config();

const page_renderer = (view) => {
    return async (req, res) => {
        try {
            const response = await fetch('http://localhost:3000/api/posts');
            const posts = await response.json();

            res.render(view, {
                layout: false,
                posts
            });
        } catch (err) {
            console.error("Error loading post template:", err);
            res.status(500).send("Error loading page");
        }
    };
};



module.exports = {page_renderer}