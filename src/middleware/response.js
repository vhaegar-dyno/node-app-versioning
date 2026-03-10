const ApiError = require('./apiError');
const config = require('@config/config');

class Response {
	constructor(res, success, err, data, message) {
		let out = {
			status: success,
		};
		if (success) {
			out.message = message;
			if (data) out.data = data;
			res.status(200).send(out);

			return;
		}

		console.error(err);
		if (config.env !== 'testing') console.error(err.message);
		if (err instanceof ApiError) {
			out.message = err.message;
			res.status(err.code).send(out);
			return;
		}

		res.status(500).send('Server error');
	}

	static success(res, message, data) {
		if (!res.headersSent) {
			return new Response(res, true, null, data, message);
		}
	}

	static error(res, err) {
		if (!res.headersSent) {
			return new Response(res, false, err);
		}
	}
}

module.exports = Response;
