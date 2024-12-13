const Joi = require('joi');

const userAccountSchema = Joi.object({
	email: Joi.string().email().trim().max(50).required(),
	name: Joi.string()
		.trim().max(50)
		.required()
		.messages({
			'string.pattern.base': `Le nom n'est pas valide`
		}),
	color: Joi.string().uppercase().pattern(new RegExp('^#[0-9A-F]{6}$')).required()
});

module.exports = {
	userAccountSchema
};
