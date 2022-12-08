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
        req.flash('success', 'Great Job Signing Up!');
        res.redirect('/members');
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
    res.redirect('/members');
});

module.exports = router;