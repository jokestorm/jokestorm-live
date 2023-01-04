const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const postsRoutes = require('./routes/posts');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const User = require('./models/user');

// Link to database
mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

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

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass the flash message to the req
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/posts', postsRoutes);
app.use('/', usersRoutes);
// Since we want this ID, we need to use {mergeParams: true} in the router
app.use('/posts/:id/reviews', reviewsRoutes);

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/idle', (req, res) => {
    res.render('idle/idle');
});

app.get('/tanks', (req, res) => {
    res.render('tanks/tanks')
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
