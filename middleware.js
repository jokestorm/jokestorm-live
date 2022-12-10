module.exports.isLoggedIn = (req, res, next) => {
    console.log('Is Logged In');
    if (!req.isAuthenticated()) {
        console.log('Is Not Logged In');

        req.flash('error', 'sign in pls');
        return res.redirect('/login');
    }
    console.log('Is Logged In');

    next();
}