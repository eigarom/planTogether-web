const Joi = require('joi');

const imageSchema = Joi.object({
	file: Joi.object({
		buffer: Joi.binary().required(),
		mimetype: Joi.string()
			.valid('image/jpeg', 'image/png')
			.required(),
		size: Joi.number()
			.max(5 * 1024 * 1024) // Taille maximale de 5 Mo
			.required(),
	}).required(),
});

module.exports = {
	imageSchema
};
