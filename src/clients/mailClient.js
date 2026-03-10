const nodemailer = require('nodemailer');
const config = require('@config/config');

const mailConfig = {
	...(config.env === 'development'
		? { service: 'gmail' }
		: {
			host: 'smtp.office365.com',
			port: 587,
			name: 'holmiumtechnologies.com',
			secure: false,
		}),
};

const mailClient = nodemailer.createTransport({
	...mailConfig,
	auth: {
		user: config.email.username,
		pass: config.email.password,
	},
	tls: {
		rejectUnauthorized: false, // Optional: helps avoid certificate issues in dev
	},
});

module.exports = mailClient;
