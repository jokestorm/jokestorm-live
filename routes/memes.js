const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { memeSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
const Meme = require('../models/meme');

const router = express.Router();

// Middleware to validate using a JOI schema
const validateMeme = (req, res, next) => {
    const { error } = memeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const memes = await Meme.find({});
    res.render('memes/index', { memes });
}));

// New meme route, POST to /memes
router.post('/', isLoggedIn, validateMeme, catchAsync(async (req, res, next) => {
    const meme = new Meme(req.body.meme);
    await meme.save();
    req.flash('success', 'New Meme Success');
    res.redirect(`/memes/${meme._id}`);
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('memes/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    // Populate reviews because we are only storing an ID
    const meme = await Meme.findById(req.params.id).populate('reviews');
    if (!meme) {
        req.flash('error', 'Unable to find meme');
        return res.redirect('/memes');
    }
    res.render('memes/show', { meme });
}));

router.put('/:id', isLoggedIn, validateMeme, catchAsync(async (req, res) => {
    const { id } = req.params;
    const meme = await Meme.findByIdAndUpdate(id, { ...req.body.meme });
    req.flash('success', 'Successfully updated.');
    res.redirect(`/memes/${meme._id}`);
}));

// Delete a meme by id, DELETE to /memes/:id
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Meme.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted meme.');
    res.redirect('/memes');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
        req.flash('error', 'Unable to find meme');
        return res.redirect('/memes');
    }
    res.render('memes/edit', { meme });
}));

module.exports = router;