module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        console.log('Is Not Logged In');

        req.flash('error', 'sign in pls');
        return res.redirect('/login');
    }

    next();
}