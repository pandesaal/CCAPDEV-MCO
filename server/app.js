const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const hbs = require('express-handlebars');

const htmlFolder = path.join(__dirname, "..", "client/html")
const components = path.join(htmlFolder, "components")
const pages = path.join(htmlFolder, "pages")

const authRoutes = require('../server/routes/index');
const Post = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment');

dotenv.config();
const app = express();
const PORT = 3000;
const route = require('../server/routes/index');
app.use(express.json());
app.post('/login', route);
app.post('/signup', route);

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    partialsDir: components
}))
app.set('view engine', 'hbs');
app.set('views', pages)

app.use(express.static(path.join(__dirname, '../client')));

app.use('/', authRoutes)

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