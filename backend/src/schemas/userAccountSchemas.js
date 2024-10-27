const Joi = require('joi');

const userAccountSchema = Joi.object({
	email: Joi.string().email().trim().max(50).required(),
	name: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9- ]+$'))
		.trim().max(50)
		.required()
		.messages({
			'string.pattern.base': `Le nom n'est pas valide`
		}),
	color: Joi.string().uppercase().pattern(new RegExp('^#[0-9A-F]{6}$')).required(),
	lang: Joi.string().valid('en', 'fr').required(),
	theme: Joi.string().valid('dark', 'light').required()
});

module.exports = {
	userAccountSchema
};