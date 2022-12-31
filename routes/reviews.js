const express = require('express');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Meme = require('../models/meme');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');

const router = express.Router({ mergeParams: true });

// Middleware to validate using a JOI schema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const meme = await Meme.findById(id);
    const review = new Review(req.body.review);
    meme.reviews.push(review);
    await review.save();
    await meme.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/memes/${meme._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const { id, reviewId } = req.params;
    await Meme.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/memes/${id}`);
}));

module.exports = router;