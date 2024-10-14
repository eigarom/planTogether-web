const Joi = require('joi');

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{16,}$'))
		.required()
		.messages({
			'string.pattern.base':
				'"password" must be at least 16 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
		})
});

module.exports = {
	loginSchema
};