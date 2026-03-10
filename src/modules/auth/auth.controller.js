const ApiError = require('@middlewares/apiError');
const Response = require('@middlewares/response');

const verifyUser = (req, res) => {
	try {
		const result = req.user;
		return Response.success(res, 'User verified successfully.', result);
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};

module.exports = { verifyUser };
