const Joi = require('joi');

const eventSchema = Joi.object({
    name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9- \\u00C0-\\u00FF]+$'))
        .max(50)
        .required(),
    description: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9- \\u00C0-\\u00FF]+$'))
        .max(300),
});

module.exports = {
    eventSchema
};