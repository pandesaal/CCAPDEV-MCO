const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const htmlFolder = path.join(__dirname, "../..", "client/html")
const pages = path.join(htmlFolder, "pages")

dotenv.config();

const page_renderer = (filename) => {
    return (req, res) => {
        let page = fs.readFileSync(path.join(pages, `${filename}.html`), 'utf8');
        page = page.replace('<div id="navbar"></div>', `<div id="navbar">${res.locals.navbar}</div>`);
        page = page.replace('<div id="register-wrapper"></div>', `<div id="register-wrapper">${res.locals.register} ${res.locals.modals}</div>`);
        res.send(page);
    }
}

module.exports = {page_renderer}