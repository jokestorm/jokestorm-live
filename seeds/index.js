const mongoose = require('mongoose')
const posts = require('./posts')
const Post = require('../models/post');

mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const post = new Post({
            author: '63b3b34e4bfedb97e73fc36a',
            title: `${posts[i].title}`,
            description: `${posts[i].description}`
        })
        await post.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});