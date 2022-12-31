const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', catchAsync(async (req, res) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Great Job Signing Up!');
            res.redirect('/memes');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome');
    // This logic below does not work. The session changes when user is logged in, so the returnTo property is undefined
    // TODO: update the logic to pass the path through the redirect with a query string.
    const redirectUrl = req.session.returnTo || '/memes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/memes');
    });
});

module.exports = router;