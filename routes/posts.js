const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validatePost, isAuthor } = require('../middleware');
const Post = require('../models/post');
const posts = require('../controllers/posts');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
const router = express.Router();

router.route('/')
    .get(catchAsync(posts.index))
    // .post(isLoggedIn, validatePost, catchAsync(posts.createPost))
    .post(upload.array('image'), (req, res ) => {
        console.log(req.body, req.files);
        res.send('it worked')
    })

router.get('/new', isLoggedIn, posts.renderNewForm);

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, validatePost, catchAsync(posts.editPost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm));

module.exports = router;