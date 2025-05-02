const ApiError = require('../../middleware/apiError');
const Response = require('../../middleware/response');
const HealthCheckServices = require('./health-check.service');

const checkSystemHealth = (req, res) => {
	try {
		const result = HealthCheckServices.getSystemHealth();
		return Response.success(res, 'System health found successfully.', result);
	} catch (err) {
		if (err instanceof ApiError) return Response.error(res, err);
		return Response.error(res, ApiError.internal(err));
	}
};

module.exports = { checkSystemHealth };
