const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { postSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
const Post = require('../models/post');

const router = express.Router();

// Middleware to validate using a JOI schema
const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
}));

// New post route, POST to /posts
router.post('/', isLoggedIn, validatePost, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully submitted a new post!');
    res.redirect(`/posts/${post._id}`);
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('posts/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    // Populate reviews because we are only storing an ID
    const post = await Post.findById(req.params.id).populate('reviews').populate('author');
    if (!post) {
        req.flash('error', 'Unable to find post');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
}));

router.put('/:id', isLoggedIn, validatePost, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    req.flash('success', 'Successfully updated.');
    res.redirect(`/posts/${post._id}`);
}));

// Delete a post by id, DELETE to /posts/:id
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post.');
    res.redirect('/posts');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Unable to find post');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
}));

module.exports = router;