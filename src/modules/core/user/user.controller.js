const ApiError = require('@middlewares/apiError');
const Response = require('@middlewares/response');
const UserServices = require('./user.service');

const loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		if (!username || !password) throw ApiError.badRequest('Username and password are required');

		const result = await UserServices.loggingUser(username, password);
		return Response.success(res, 'User logged in successfully.', result);
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};

const createUser = async (req, res) => {
	try {
		const result = await UserServices.create(req.user, req.body);
		return Response.success(res, 'User created successfully.', result);
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};

const getUsersByOrganizationId = async (req, res) => {
	try {
		const result = await UserServices.findByOrganizationId(req.user.organizationId);
		return Response.success(res, 'Users found by organization id successfully.', result);
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};

module.exports = {
	loginUser,
	createUser,
	getUsersByOrganizationId,
};
