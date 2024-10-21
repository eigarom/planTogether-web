import Joi from 'joi';

export const registrationSchema = Joi.object({
	email: Joi.string()
		.email({tlds: {allow: false}})
		.required()
		.messages({
			'string.email': `Le courriel n'est pas valide`
		}),
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{16,}$'))
		.required()
		.max(50)
		.messages({
			'string.pattern.base': 'Le mot de passe doit contenir au moins 16 caractères, une majuscule, une' +
				' minuscule, un chiffre et un caractère spécial'
		}),
	repeat_password: Joi.any()
		.valid(Joi.ref('password'))
		.required()
		.messages({
			'any.only': 'Les mots de passe doivent être identiques'
		}),
	name: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9- ]+$'))
		.required()
		.max(50)
		.messages({
			'string.pattern.base': `Le nom n'est pas valide`
		})
});