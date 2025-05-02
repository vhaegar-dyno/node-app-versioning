const cors = require('cors');

const allowedOrigins = [
	'https://www.holmiumtechnologies.com',
	'https://www.holmiumtechnologies.com/',
	'https://www.holmiumtechnologies.com',
	'https://holmiumtechnologies.com/',
	'http://IP:PORT',
];

const corsOptions = {
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'authorization', 'Authorization'],
	origin: function (origin, callback) {
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

module.exports = cors(corsOptions);
