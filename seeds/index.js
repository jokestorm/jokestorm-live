const mongoose = require('mongoose')
const memes = require('./memes')
const Meme = require('../models/meme');

mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Meme.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const meme = new Meme({
            author: '63b3b34e4bfedb97e73fc36a',
            title: `${memes[i].title}`,
            description: `${memes[i].description}`
        })
        await meme.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});