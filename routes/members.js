const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { memberSchema } = require('../schemas');
const Member = require('../models/member');

const router = express.Router();

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

router.get('/', catchAsync(async (req, res) => {
    const members = await Member.find({});
    res.render('members/index', { members });
}));

// New member route, POST to /members
router.post('/', validateMember, catchAsync(async (req, res, next) => {
    const member = new Member(req.body.member);
    await member.save();
    res.redirect(`/members/${member._id}`);
}));

router.get('/new', (req, res) => {
    res.render('members/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    // Populate reviews because we are only storing an ID
    const member = await Member.findById(req.params.id).populate('reviews');
    res.render('members/show', { member });
}));

router.put('/:id', validateMember, catchAsync(async (req, res) => {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, { ...req.body.member });
    res.redirect(`/members/${member._id}`);
}));

// Delete a member by id, DELETE to /members/:id
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.redirect('/members');
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const member = await Member.findById(req.params.id);
    res.render('members/edit', { member });
}));

module.exports = router;