const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const route = require('./server/routes/index');

const app = express();
const PORT = 2000;

app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydatabase').then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(e => {
    console.log(e);
});

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Log In' });
});

app.use('/', route);
