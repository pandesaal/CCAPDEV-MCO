const { page_renderer } = require('../utils/page-render');

const post = (req, res) => {
    page_renderer('post')(req, res);
}

module.exports = post;