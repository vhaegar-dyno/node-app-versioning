const nodemailer = require('nodemailer');
const config = require('../config/config');

const mailClient = nodemailer.createTransport({
	service: 'gmail',
	port: 587,
	pool: true, // Todo: should debug once, maybe not required now in new version
	auth: {
		user: config.gmail.username,
		pass: config.gmail.password,
	},
});

module.exports = mailClient;
