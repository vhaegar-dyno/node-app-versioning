const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
	windowMs: 20 * 60 * 1000,
	max: 100,
	skipSuccessfulRequests: true,
});

module.exports = { rateLimiter };
