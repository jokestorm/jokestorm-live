const express = require('express');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Member = require('../models/member');
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
    const member = await Member.findById(id);
    const review = new Review(req.body.review);
    member.reviews.push(review);
    await review.save();
    await member.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/members/${member._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const { id, reviewId } = req.params;
    await Member.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/members/${id}`);
}));

module.exports = router;