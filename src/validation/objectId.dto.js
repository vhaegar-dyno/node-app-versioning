const JoiBase = require('joi');
const { ObjectId } = require('mongodb');

const Joi = JoiBase.extend((joi) => ({
	type: 'objectId',
	base: joi.any(),
	messages: {
		'objectId.invalid': 'Invalid ID provided',
	},
	// eslint-disable-next-line no-unused-vars
	coerce(value, helpers) {
		if (value instanceof ObjectId) return { value };
		if (typeof value === 'string' && ObjectId.isValid(value)) return { value: new ObjectId(value) };
		return { value };
	},
	validate(value, helpers) {
		if (!(value instanceof ObjectId) || !ObjectId.isValid(value)) {
			return { value, errors: helpers.error('objectId.invalid') };
		}
		return { value };
	},
}));

const objectIdSchema = Joi.objectId();
module.exports = objectIdSchema;
