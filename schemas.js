const Joi = require('joi')

module.exports.memberSchema = Joi.object({
    member: Joi.object({
        handle: Joi.string().required(),
        email: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})