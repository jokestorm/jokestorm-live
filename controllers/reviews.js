const Post = require('../models/post');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deleteReview = async (req, res,) => {
    const { id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/posts/${id}`);
}