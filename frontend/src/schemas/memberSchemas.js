import Joi from 'joi';

export const memberSchema = Joi.object({
	name: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9- \\u00C0-\\u00FF]+$'))
		.required()
		.max(50)
		.messages({
			'string.pattern.base': `Le nom n'est pas valide`
		}),
	color: Joi.string().uppercase().pattern(new RegExp('^#[0-9A-F]{6}$')).required(),
});