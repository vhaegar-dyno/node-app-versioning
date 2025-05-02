const Joi = require('joi');

const createZipSchema = Joi.array()
	.items(
		Joi.object({
			fileName: Joi.string().required(),
			fileContent: Joi.any().required(),
		})
	)
	.min(1)
	.required();

module.exports = {
	createZipSchema,
};
