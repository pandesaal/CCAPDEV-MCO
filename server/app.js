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

const Grid = require('gridfs-stream');

dotenv.config();
const app = express();
const PORT = 3000;
const route = require('../server/routes/index');

// ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(express.json());
app.post('/signup', route);
app.post('/login', route);
app.post('/post', route);
app.post('/comment', route);

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    partialsDir: components,
    helpers: {
        truncate: (str, len) => {
            if (str.length > len) {
                let trimmed = str.substring(0, len);
                return trimmed.substring(0, trimmed.lastIndexOf(" ")) + "...";
            }
            return str;
        },
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b
    }
}))
app.set('view engine', 'hbs');
app.set('views', pages)

app.use(express.static(path.join(__dirname, '../client')));

app.use('/', authRoutes)

app.use((req, res) => {
    res.status(404).render('404', {layout: false});
});

mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(e => {
    console.error(e);
});

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});