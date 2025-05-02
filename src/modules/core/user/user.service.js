const bcrypt = require('bcrypt');
const ApiError = require('../../../middleware/apiError');
const User = require('./user.model');
const JwtUtils = require('../../../utils/jwtUtils');
const logger = require('../../../config/logger');
const JoiValidationPipe = require('../../../middleware/joiValidation');
const { createUserSchema } = require('./user.dto');

class UserServices {
	constructor() {
		this.logger = logger;
	}
	async loggingUser(username, password) {
		const user = await this.findByUsername(username);
		if (!user) throw ApiError.notFound('Invalid credentials');

		// validating password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) throw ApiError.notAuthorized('Invalid credentials');

		// generating login token:
		const token = JwtUtils.generateToken(user);
		const result = {
			username: user.username,
			userType: user.userType,
			token,
		};

		return result;
	}

	async create(loggedInUser, payload) {
		// validate only superadmin can create new user:
		if (loggedInUser.userType !== 'superAdmin')
			throw ApiError.notAuthorized('Not authorized to create new user');

		const sanitizedPayload = JoiValidationPipe.validate(createUserSchema, payload);
		if (!sanitizedPayload) return;

		// check if user already exists:
		const isExistingUser = await this.findByUsername(sanitizedPayload.username);
		if (isExistingUser) throw ApiError.alreadyExists('User already exists');

		// configure plant ids acc. to model:
		sanitizedPayload['plants'] = {
			quantity: sanitizedPayload.plantIds.length,
			id: sanitizedPayload.plantIds.join(','),
		};
		const userSchema = new User(sanitizedPayload);
		const user = await userSchema.save();
		user.password = undefined;
		return user;
	}

	async findByUsername(username) {
		return await User.findOne({ username }).select('-password').lean();
	}

	async findByOrganizationId(organizationId) {
		const users = await User.find({ organizationId });
		if (!users?.length) throw ApiError.notFound('No users found for the organization');

		const result = { approver: [], assignedTo: [] };
		for (const user of users) {
			if (!user.accessLevel?.ticketManagementSystem?.isActive) continue;
			if (user?.accessLevel?.ticketManagementSystem?.access === 'vendor') {
				result.assignedTo.push({ email: user.username, name: user.name });
			} else if (
				user?.accessLevel?.ticketManagementSystem?.access == 'SPOC' ||
				user?.accessLevel?.ticketManagementSystem?.access == 'ROC'
			) {
				result.approver.push({ email: user.username, name: user.name });
			}
		}

		return result;
	}
}

module.exports = new UserServices();
