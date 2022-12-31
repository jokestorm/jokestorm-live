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
            handle: `${memes[i].username}`,
            email: `${memes[i].email}`
        })
        await meme.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});