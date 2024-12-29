const Joi = require('joi');

const tasksListSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required()
});

const taskSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required(),
	description: Joi.string().allow(''),
	isChecked: Joi.boolean()
		.required(),
});

module.exports = {
	tasksListSchema, taskSchema
};