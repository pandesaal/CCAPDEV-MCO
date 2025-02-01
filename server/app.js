const express = require('express');
const path = require('path')
const fs = require('fs')
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'client'), { 
    extensions: ['html', 'css']
}));

const htmlFolder = path.join(__dirname, "..", "client/html")
const components = path.join(htmlFolder, "components")
const pages = path.join(htmlFolder, "pages")

app.use((req, res, next) => {
    const navbar = fs.readFileSync(path.join(components, "nav.html"), 'utf8');
    res.locals.navbar = navbar;
    next();
});

app.get('/', (req, res) => {
    const page = fs.readFileSync(path.join(pages, "index.html"), 'utf8');
    res.send(res.locals.navbar + page);
});

app.get('/profile', (req, res) => {
    const page = fs.readFileSync(path.join(pages, "profile.html"), 'utf8');
    res.send(res.locals.navbar + page);
});

// app.get('/profile', (req, res) => {
//     const page = fs.readFileSync(path.join(pages, "profile.html"), 'utf8');
//     res.send(res.locals.navbar + page);
// });
// copy commented code, edit /profile and profile.html into your html files
// for pages that dont need navbars jsut remove res.locals.navbar sa res.send

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


