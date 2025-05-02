class ApiError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.message = message;
	}

	static badRequest(msg) {
		return new ApiError(400, msg);
	}

	static notAuthorized(msg) {
		return new ApiError(401, msg || 'User not authorized');
	}

	static alreadyExists(msg) {
		return new ApiError(403, msg || 'Already exists');
	}

	static notActive(msg) {
		return new ApiError(403, msg || 'Found but not active');
	}

	static notFound(msg) {
		return new ApiError(404, msg || 'Not found');
	}

	static internal(err) {
		console.error(err);
		return new ApiError(500, 'Server error: ' + err.message);
	}
}

module.exports = ApiError;
