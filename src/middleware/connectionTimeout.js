const config = require('../config/config');

const connectionTimeout = (req, res, next) => {
	res.setTimeout(config.connectionTimeout, () => {
		return res.status(408).json({ status: false, message: 'Request timed out' });
	});
	next();
};

module.exports = { connectionTimeout };
