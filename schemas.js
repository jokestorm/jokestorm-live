const Joi = require('joi')

module.exports.memberSchema = Joi.object({
    member: Joi.object({
        handle: Joi.string().required(),
        email: Joi.string().required()
    }).required()
});