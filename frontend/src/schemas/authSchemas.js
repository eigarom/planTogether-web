import Joi from 'joi';

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({tlds: {allow: false}})
		.required()
		.messages({
			'string.email': `Le courriel n'est pas valide.`,
			'string.empty': 'Le courriel est requis.'
		}),
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{16,}$'))
		.required()
		.messages({
			'string.pattern.base':
				'Le mot de passe doit contenir au moins 16 caractères, une majuscule, une minuscule, un chiffre et' +
				' un caractère spécial.',
			'string.empty': 'Le mot de passe est requis.'
		}),
});