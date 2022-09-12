const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const Member = require('./models/member')

mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}))
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/new-member', async (req, res) => {
    const member = new Member({ handle: "Jokestorm", email: "test@test.com" })
    await member.save();
    res.send(member)
})

app.get('/members', async (req, res) => {
    const members = await Member.find({});
    res.render('members/index', { members })
})

app.get('/members/new', (req, res) => {
    res.render('members/new');
})

app.get('/idle', (req, res) => {
    res.render('idle/idle');
})

app.post('/members', async (req, res) => {
    res.send(req.body)
})

app.get('/members/:id', async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/show', { member })
})

app.listen(3000, () => {
    console.log('listening')
});