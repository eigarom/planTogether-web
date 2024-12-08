const Joi = require('joi');

const eventSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),
    description: Joi.string()
        .max(500),
    isVisible: Joi.boolean()
        .required(),
    periods: Joi.array()
        .items(
            Joi.object({
                startDateTime: Joi.date().required(),
                endDateTime: Joi.date().greater(Joi.ref('startDateTime')).required(),
                alerts: Joi.array()
                    .items(
                        Joi.date()
                            .less(Joi.ref('...startDateTime'))
                            .required()
                    )
                    .optional()
            })
        )
        .required(),
    members: Joi.array()
        .required()
});

const eventOnlySchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),
    description: Joi.string()
        .max(500),
    isVisible: Joi.boolean()
        .required(),
    members: Joi.array()
        .required()
});

const periodSchema = Joi.object({
    startDateTime: Joi.date().required(),
    endDateTime: Joi.date().greater(Joi.ref('startDateTime')).required(),
    alerts: Joi.array()
        .items(
            Joi.date()
                .less(Joi.ref('...startDateTime'))
                .required()
        )
        .optional()
});

module.exports = {
    eventSchema, eventOnlySchema, periodSchema
};