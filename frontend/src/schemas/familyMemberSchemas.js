import Joi from 'joi';

export const createFamilyMemberSchema = Joi.object({
	name: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9- ]+$'))
		.required()
		.max(50)
		.messages({
			'string.pattern.base': `Le nom n'est pas valide`
		})
});