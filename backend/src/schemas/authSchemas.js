const Joi = require('joi');

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		// .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{16,}$'))
		.required()
	// .messages({
	// 	'string.pattern.base':
	// 		'Le mot de passe doit comporter au moins 16 caractères, incluant au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.'
	// })
});

module.exports = {
	loginSchema
};