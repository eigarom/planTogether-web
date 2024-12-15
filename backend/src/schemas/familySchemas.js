const Joi = require('joi');

const familySchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required(),
	color: Joi.string().uppercase().pattern(new RegExp('^#[0-9A-F]{6}$')).required()
});

const inviteCodeSchema = Joi.object({
	inviteCode: Joi.string().required().messages({
		'string.base': `Le code d'invitation doit être une chaîne de caractères`,
		'string.empty': `Le code d'invitation ne peut pas être vide`,
		'any.required': `Le code d'invitation est requis`
	})
});

module.exports = {
	familySchema,
	inviteCodeSchema
};
