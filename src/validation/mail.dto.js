const Joi = require('joi');

const sendMailSchema = Joi.object({
	to: Joi.string().email().required(),
	cc: Joi.array().items(Joi.string().email()),
	bcc: Joi.array().items(Joi.string().email()),
	subject: Joi.string().required(),
	text: Joi.string(),
	html: Joi.string(),
	attachments: Joi.array().items(
		Joi.object({
			filename: Joi.string().required(),
			path: Joi.string().required(),
			contentType: Joi.string().required(),
		})
	),
}).or('text', 'html', 'attachments');

module.exports = {
	sendMailSchema
};
