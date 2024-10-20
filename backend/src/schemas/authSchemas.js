const Joi = require('joi');

const loginSchema = Joi.object({
	email: Joi.string().email().required(), password: Joi.string().required()
});

const registerSchema = Joi.object({
	email: Joi.string().email().trim().max(50).required(), password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{16,}$'))
		.trim()
		.max(50)
		.required()
		.messages({
			'string.pattern.base': 'Le mot de passe doit contenir au moins 16 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
		})
});

module.exports = {
	loginSchema, registerSchema
};