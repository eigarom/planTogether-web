const Joi = require('joi');

const shoppingListSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required()
});

const shoppingItemSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.required(),
	isChecked: Joi.boolean()
		.required(),
});

module.exports = {
	shoppingListSchema, shoppingItemSchema
};