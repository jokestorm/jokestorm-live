const express = require('express');

const catchAsync = require('../utils/catchAsync');

const Post = require('../models/post');
const Review = require('../models/review');
const { validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/posts/${post._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const { id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/posts/${id}`);
}));

module.exports = router;