const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');

const members = require('./routes/members');
const reviews = require('./routes/reviews');

// Link to database
mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'ReplaceThisInProd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use('/members', members);

// Since we want this ID, we need to use {mergeParams: true} in the router
app.use('/members/:id/reviews', reviews);

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/idle', (req, res) => {
    res.render('idle/idle');
});

// 404 Responder
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'An error has occurred';
    res.status(statusCode).render('error', { err });
});

// Server start listening
app.listen(3000, () => {
    console.log('listening');
});
