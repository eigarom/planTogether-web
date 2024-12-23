const Joi = require('joi');

const taskSListSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required()
});

const taskSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required(),
	description: Joi.string(),
	isChecked: Joi.boolean()
		.required(),
});

module.exports = {
	taskSListSchema, taskSchema
};