const Joi = require('joi');

const capacitySchema = Joi.object({
	AC: Joi.number().min(1).required(),
	DC: Joi.number().min(1).required(),
});

const coordinatesSchema = Joi.object({
	latitude: Joi.number().min(-90).max(90).allow(null).default(null),
	longitude: Joi.number().min(-180).max(180).allow(null).default(null),
});

const locationSchema = Joi.object({
	address: Joi.string(),
	state: Joi.string(),
	country: Joi.string(),
	pinCode: Joi.string(),
	timezone: Joi.string(),
	coordinates: coordinatesSchema,
});

module.exports = { capacitySchema, locationSchema };
