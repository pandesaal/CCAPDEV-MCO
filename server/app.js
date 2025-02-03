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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const navbar = fs.readFileSync(path.join(components, "nav.html"), 'utf8');
    res.locals.navbar = navbar;

    const register = fs.readFileSync(path.join(components, "register.html"), 'utf8');
    res.locals.register = register;
    next();
});

app.get('/', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "index.html"), 'utf8');
    page = page.replace('<div id="navbar"></div>', `<div id="navbar">${res.locals.navbar}</div>`);
    page = page.replace('<div id="register-wrapper"></div>', `<div id="register-wrapper">${res.locals.register}</div>`);
    res.send(page);
});

app.get('/profile', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "profile.html"), 'utf8');
    page = page.replace('<div id="navbar"></div>', `<div id="navbar">${res.locals.navbar}</div>`);
    page = page.replace('<div id="register-wrapper"></div>', `<div id="register-wrapper">${res.locals.register}</div>`);
    res.send(page);
});

app.get('/search', (req, res) => {
    let page = fs.readFileSync(path.join(pages, "search.html"), 'utf8');
    page = page.replace('<div id="navbar"></div>', `<div id="navbar">${res.locals.navbar}</div>`);
    page = page.replace('<div id="register-wrapper"></div>', `<div id="register-wrapper">${res.locals.register}</div>`);
    res.send(page);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

