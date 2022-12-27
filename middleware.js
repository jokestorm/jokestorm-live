module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'sign in pls');
        return res.redirect('/login');
    }
    next();
}