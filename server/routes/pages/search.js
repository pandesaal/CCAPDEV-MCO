const { page_renderer } = require('../../utils/page-render');

const search = (req, res) => {
    page_renderer('search')(req, res);
}

module.exports = search;