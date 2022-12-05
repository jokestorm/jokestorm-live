const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/signup', async(req, res) => {
    res.send(req.body);
})
module.exports = router;