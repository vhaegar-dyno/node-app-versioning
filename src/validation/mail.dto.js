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

const sendTmsActionMailSchema = Joi.object({
	ticketId: Joi.number().required(),
	subject: Joi.string().required(),
	category: Joi.string().required(),
	status: Joi.string().required(),
	priority: Joi.string().required(),
	createdAt: Joi.date().required(),
	dueAt: Joi.date().required(),
	description: Joi.string(),
	notifiedUsers: Joi.array().items(
		Joi.object({
			name: Joi.string(),
			emailId: Joi.string().email(),
		}).unknown()
	),
	possibleCause: Joi.string(),
	// updatedBy: Joi.string(),
	// updatedOn: Joi.string().required(),
	actionDescription: Joi.string(),
	createdBy: {
		name: Joi.string().required(),
		emailId: Joi.string().email().required(),
	},
	assignedTo: {
		name: Joi.string().required(),
		emailId: Joi.string().email().required(),
	},
	site: Joi.object({
		name: Joi.string().required(),
		capacity: Joi.number(),
		affectedCapacity: Joi.number(),
		equipmentName: Joi.string(),
	})
		.unknown()
		.required(),
}).unknown();

module.exports = {
	sendMailSchema,
	sendTmsActionMailSchema,
};
