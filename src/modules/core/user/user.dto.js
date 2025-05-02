const Joi = require('joi');

const createUserSchema = Joi.object({
	username: Joi.string().trim().required(),
	password: Joi.string().min(7).max(255).required(),
	category: Joi.string(),
	pin: Joi.string(),
	clientName: Joi.string().required(),
	clientLogo: Joi.string().required(),
	plantIds: Joi.array().items(Joi.number().required()).required(),
	// plants: Joi.string(),
	plantImages: Joi.array().items(Joi.string().required()).required(),
	userType: Joi.string(),
	email: Joi.string().email(),
	name: Joi.string().trim(),
	mobileNo: Joi.string().length(10).trim(),
	emailId: Joi.array().items(
		Joi.object({
			type: Joi.string().required(),
			id: Joi.string().required(),
		})
	),
	organizationId: Joi.string(),
	accessLevel: Joi.object({
		ticketManagementSystem: Joi.object({
			isActive: Joi.boolean().default(false),
			access: Joi.string(),
		}),
	}),
});

module.exports = {
	createUserSchema,
};
