const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
	windowMs: 20 * 60 * 1000,
	max: 40000,
	skipSuccessfulRequests: false,
	keyGenerator: (req) => {
		// req.ip may include a port (e.g. "49.36.144.209:61732")
		// Split on “:” and take the first segment for IPv4,
		// or handle IPv6 properly if needed:
		let ip = req.ip;
		if (ip.includes(':')) {
			// For IPv4 with port:
			const parts = ip.split(':');
			if (parts.length === 2 && parts[0].match(/^\d+\.\d+\.\d+\.\d+$/)) {
				ip = parts[0];
			}
			// For IPv6 you may need more robust parsing
		}
		return ip;
	},
	handler: (req, res) => {
		return res.status(429).json({
			status: false,
			message: 'Too many requests. Please try again later.',
		});
	},
});

const clientsRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 60,
	skipSuccessfulRequests: false,
	keyGenerator: (req) => {
		let ip = req.ip;
		if (ip.includes(':')) {
			// For IPv4 with port:
			const parts = ip.split(':');
			if (parts.length === 2 && parts[0].match(/^\d+\.\d+\.\d+\.\d+$/)) {
				ip = parts[0];
			}
		}
		return ip;
	},
	handler: (req, res) => {
		return res.status(429).json({
			status: false,
			message: 'Too many requests. Please try again later.',
		});
	},
});

module.exports = { rateLimiter, clientsRateLimiter };
