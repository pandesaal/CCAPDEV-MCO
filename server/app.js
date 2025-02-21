const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const hbs = require('express-handlebars');

const home = require('./routes/home');
const profile = require('./routes/profile');
const search = require('./routes/search');
const post = require('./routes/post');

const Post = require('../server/models/Post');
const Comment = require('../server/models/Comment');
const User = require('../server/models/User');
const getPostData = require('./controllers/api/posts');

const htmlFolder = path.join(__dirname, "..", "client/html")
const components = path.join(htmlFolder, "components")
const pages = path.join(htmlFolder, "pages")

dotenv.config();
const app = express();
const PORT = 3000;

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    partialsDir: components
}))
app.set('view engine', 'hbs');
app.set('views', pages)

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', home);
app.get('/:username', profile);
app.get('/search', search);
app.get('/post/:id', post);

app.get('/api/posts', getPostData);

app.use((req, res, next) => {
    res.status(404).render('404', {});
});

mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(e => {
    console.log(e);
});