const User = require('../models/user');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup');
}

module.exports.signup = async (req, res) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Great Job Signing Up!');
            res.redirect('/posts');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome');
    const redirectUrl = res.locals.returnTo || '/posts';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/posts');
    });
}
