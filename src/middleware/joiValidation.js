const ApiError = require('./apiError');

class JoiValidationPipe {
	static validate(schema, payload) {
		const { error, value } = schema.validate(payload, {
			abortEarly: false,
			convert: true,
			// stripUnknown: true	//? this will remove unknown keys from payload
		});
		if (error) {
			throw ApiError.badRequest(error.details[0].message.replace(/["\\]/g, ''));
		}

		return value;
	}
}

module.exports = JoiValidationPipe;
