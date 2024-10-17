const Joi = require('joi');

const familySchema = Joi.object({
	name: Joi.string().trim().alphanum().max(50).required(),
	color: Joi.string().max(10).trim().required(),
	imageContent: Joi.string().trim(),
    imageContentType: Joi.string().max(10).trim(),
});

module.exports = {
};
