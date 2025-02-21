const { page_renderer } = require('../utils/page-render');

const home = (req, res) => {
    page_renderer('home')(req, res);
}

module.exports = home;