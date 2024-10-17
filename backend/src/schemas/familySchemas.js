const Joi = require('joi');

const familySchema = Joi.object({
	name: Joi.string().trim().alphanum().required(),
	color: Joi.string().trim().required(),
	imageContent: Joi.string().trim(),
    imageContentType: Joi.string().trim(),
});

module.exports = {
};
