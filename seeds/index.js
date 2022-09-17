const mongoose = require('mongoose')
const members = require('./members')
const Member = require('../models/member');
const { emit } = require('../models/member');

mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Member.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const member = new Member({
            handle: `${members[i].username}`,
            email: `${members[i].email}`
        })
        await member.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});