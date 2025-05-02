const JwtUtils = require('../utils/jwtUtils');
const ApiError = require('./apiError');
const Response = require('./response');
const UserServices = require('../modules/core/user/user.service');

module.exports = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization || req.headers.Authorization;
		if (!authorization || authorization === '') throw ApiError.badRequest('Token is required');

		const [, token] = authorization.split(' ');
		if (!token || token === '') throw ApiError.badRequest('Token is required');

		const verifiedUser = JwtUtils.verifyToken(token);
		if (!verifiedUser) throw ApiError.unauthorized('User not authorized');

		// Adding user details to request:
		const user = await UserServices.findByUsername(verifiedUser.username);
		if (!user) throw ApiError.notFound('User not found');

		req.user = user;
		next();
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};
