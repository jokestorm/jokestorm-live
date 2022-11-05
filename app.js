const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const Joi = require('joi');
const { memberSchema, reviewSchema } = require('./schemas')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const Member = require('./models/member');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

// Link to databases
mongoose.connect('mongodb://localhost:27017/jokestorm-live-dev', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Middleware to validate using a JOI schema
const validateMember = (req, res, next) => {
    const { error } = memberSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/members', catchAsync(async (req, res) => {
    const members = await Member.find({});
    res.render('members/index', { members });
}));

app.get('/members/new', (req, res) => {
    res.render('members/new');
});

app.get('/idle', (req, res) => {
    res.render('idle/idle');
});

// New member route, POST to /members
app.post('/members', validateMember, catchAsync(async (req, res, next) => {
    const member = new Member(req.body.member);
    await member.save();
    res.redirect(`/members/${member._id}`);
}));

app.get('/members/:id', catchAsync(async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/show', { member });
}));

app.get('/members/:id/edit', catchAsync(async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/edit', { member });
}));

app.put('/members/:id', validateMember, catchAsync(async (req, res) => {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, { ...req.body.member });
    res.redirect(`/members/${member._id}`);
}));

// Delete a member by id, DELETE to /members/:id
app.delete('/members/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.redirect('/members');
}));

app.post('/members/:id/reviews', validateReview, catchAsync(async ( req, res) => {
    const { id } = req.params;
    const member = await Member.findById(id);
    const review = new Review(req.body.review);
    member.reviews.push(review);
    await review.save();
    await member.save();
    res.redirect(`/members/${member._id}`);
}));

app.get('/idle.js', async (req, res) => {
    res.sendFile('views/idle/idle.js', { root: __dirname });
});

app.get('/idle.css', async (req, res) => {
    res.sendFile('views/idle/idle.css', { root: __dirname });
});

app.get('/Orange-Cat.png', async (req, res) => {
    res.sendFile('views/idle/Orange-Cat.png', { root: __dirname });
});

app.get('/Discord-Logo-White.svg', async (req, res) => {
    res.sendFile('views/idle/Discord-Logo-White.svg', { root: __dirname });
});

app.get('/J.png', async (req, res) => {
    res.sendFile('views/J.png', { root: __dirname });
});

// 404 Responder
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'An error has occurred';
    res.status(statusCode).render('error', { err });
});

// Server start listening
app.listen(3000, () => {
    console.log('listening');
});
