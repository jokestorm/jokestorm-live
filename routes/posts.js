const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validatePost, isAuthor } = require('../middleware');
const Post = require('../models/post');
const posts = require('../controllers/posts')

const router = express.Router();


router.get('/', catchAsync(posts.index));

router.get('/new', isLoggedIn, posts.renderNewForm);

router.post('/', isLoggedIn, validatePost, catchAsync(posts.createPost));

router.get('/:id', catchAsync(posts.showPost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validatePost, catchAsync(posts.editPost));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(posts.deletePost));

module.exports = router;