const Joi = require('joi');

const memberSchema = Joi.object({
	name: Joi.string()
			.pattern(new RegExp('^[a-zA-Z0-9- \\u00C0-\\u00FF]+$'))
			.max(50)
			.required(),
	color: Joi.string().uppercase().pattern(new RegExp('^#[0-9A-F]{6}$')).required()
});

module.exports = {
    memberSchema
};