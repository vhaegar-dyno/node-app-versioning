const Joi = require('joi');

const uploadToS3Schema = Joi.object({
	bucketName: Joi.string().required(),
	filePath: Joi.string().required(),
	file: Joi.required(),
	fileName: Joi.string().required(),
});

module.exports = {
	uploadToS3Schema,
};
