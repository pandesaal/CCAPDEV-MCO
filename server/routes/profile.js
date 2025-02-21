const { page_renderer } = require('../utils/page-render');

const profile = (req, res) => {
    page_renderer('profile')(req, res);
}

module.exports = profile;