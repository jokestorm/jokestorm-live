const Joi = require('joi')

module.exports.postSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        description: Joi.string()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})