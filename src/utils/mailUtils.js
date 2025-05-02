const mailClient = require('../clients/mailClient');
const config = require('../config/config');
const ApiError = require('../middleware/apiError');
const { sendMailSchema } = require('../validation/mail.dto');

class MailUtils {
	constructor(gmailClient = mailClient) {
		this.gmailClient = gmailClient;
		this.logger = require('../config/logger');
		this.JoiValidationPipe = require('../middleware/joiValidation');
	}

	async sendMail(mailOptions) {
		try {
			const sanitizedOptions = this.JoiValidationPipe.validate(sendMailSchema, mailOptions);
			sanitizedOptions['from'] = `${config.gmail.displayName} ${config.gmail.senderEmail}`;

			if (config.env !== 'production') {
				sanitizedOptions['to'] = config.gmail.devEmail;
				sanitizedOptions['cc'] = undefined;
				sanitizedOptions['bcc'] = undefined;
			}

			const sendMail = await this.gmailClient.sendMail(sanitizedOptions);
			if (!sendMail.messageId) throw ApiError.badRequest('Failed to send mail');

			this.logger.info(' 📧  Mail sent to: ' + sanitizedOptions.to);
			return sendMail;
		} catch (err) {
			this.logger.error(`Error sending mail: ${err.message}`);
		}
	}
}

module.exports = new MailUtils();
