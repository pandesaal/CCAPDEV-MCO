const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../client')));

const htmlFolder = path.join(__dirname, "..", "client/html")
const components = path.join(htmlFolder, "components")
const pages = path.join(htmlFolder, "pages")

app.use((req, res, next) => {
    const navbar = fs.readFileSync(path.join(components, "nav.html"), 'utf8');
    res.locals.navbar = navbar;
    next();
});

app.get('/', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "index.html"), 'utf8');
    page = page.replace('<div id="navbar-wrapper"></div>', `<div id="navbar-wrapper">${res.locals.navbar}</div>`);
    res.send(page);
});

app.get('/profile', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "profile.html"), 'utf8');
    page = page.replace('<div id="navbar-wrapper"></div>', `<div id="navbar-wrapper">${res.locals.navbar}</div>`);
    res.send(page);
});

app.get('/search', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "search.html"), 'utf8');
    page = page.replace('<div id="navbar-wrapper"></div>', `<div id="navbar-wrapper">${res.locals.navbar}</div>`);
    res.send(page);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


