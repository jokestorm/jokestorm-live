const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const Member = require('./models/member');

mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/new-member', async (req, res) => {
    const member = new Member({ handle: "Jokestorm", email: "test@test.com" })
    await member.save();
    res.send(member)
});

app.get('/members', async (req, res) => {
    const members = await Member.find({});
    res.render('members/index', { members });
});

app.get('/members/new', (req, res) => {
    res.render('members/new');
});

app.get('/idle', (req, res) => {
    res.render('idle/idle');
});

app.post('/members', async (req, res) => {
    const member = new Member(req.body.member);
    await member.save();
    res.redirect(`/members/${member._id}`);
});

app.get('/members/:id', async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/show', { member });
});

app.get('/members/:id/edit', async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/edit', { member });
});

app.put('/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, { ...req.body.member });
    res.redirect(`/members/${member._id}`);
});

app.delete('/members/:id', async (req, res) => {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.redirect('/members');
});

app.get('/idle.js', async (req,res) => {
    res.sendFile('views/idle/idle.js',{root: __dirname});
});

app.get('/idle.css', async (req,res) => {
    res.sendFile('views/idle/idle.css',{root: __dirname});
});

app.get('/Orange-Cat.png', async (req,res) => {
    res.sendFile('views/idle/Orange-Cat.png',{root: __dirname});
});

app.get('/Discord-Logo-White.svg', async (req,res) => {
    res.sendFile('views/idle/Discord-Logo-White.svg',{root: __dirname});
});

app.get('/J.png', async (req,res) => {
    res.sendFile('views/J.png',{root: __dirname});
});

app.use((req,res) => {
    res.send(`404: Didn't find anything at ${req.path} from ${req.ip}`);
})

app.use((err, req, res, next) => {
    next(err);
})

app.listen(3000, () => {
    console.log('listening');
});
