const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signup', (req, res) => {
    res.render('users/signup');
})

module.exports = router;