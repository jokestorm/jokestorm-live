const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
}

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await post.save();
    req.flash('success', 'Successfully submitted a new post!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.showPost = async (req, res) => {
    // Populate reviews because we are only storing an ID
    const post = await Post.findById(req.params.id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author');
    if (!post) {
        req.flash('error', 'Unable to find post');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Unable to find post');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post.');
    res.redirect('/posts');
}

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated.');
    res.redirect(`/posts/${post._id}`);
}