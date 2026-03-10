const crypto = require('crypto');
const cryptoJs = require('crypto-js');
const { security } = require('@config/config');
const ApiError = require('@middlewares/apiError');
const logger = require('@config/logger');

class SecuredUtils {
	static ENCRYPTION_KEY = Buffer.from(security.secureKey, 'hex');
	static IV = Buffer.from(security.secureIv, 'hex');

	encryptPayload(object = {}, expDay) {
		const cipher = crypto.createCipheriv(
			'aes-256-cbc',
			SecuredUtils.ENCRYPTION_KEY,
			SecuredUtils.IV
		);
		// add expiry of 30 days to object:
		if (expDay > 0) {
			object['exp'] = Math.floor(Date.now() / 1000) + expDay * 24 * 60 * 60;
		}

		let encrypted = cipher.update(JSON.stringify(object), 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const ivHex = SecuredUtils.IV.toString('hex');
		return ivHex + ':' + encrypted;
	}

	decryptPayload(payload = '') {
		try {
			payload = decodeURIComponent(payload);

			const [ivHex, encrypted] = payload.split(':');
			const iv = Buffer.from(ivHex, 'hex');
			const decipher = crypto.createDecipheriv('aes-256-cbc', SecuredUtils.ENCRYPTION_KEY, iv);
			let decrypted = decipher.update(encrypted, 'hex', 'utf8');
			decrypted += decipher.final('utf8');
			const { exp, ...decryptedPayload } = JSON.parse(decrypted);
			const currentTime = Math.floor(Date.now() / 1000);
			if (exp < currentTime) {
				throw ApiError.notAuthorized('Token has expired');
			}
			return decryptedPayload;
		} catch (err) {
			logger.info(
				`Error while decreptying payload with err: ${err.message}, drropping detailed logs`
			);
			console.error(err);
			throw err;
		}
	}

	generateMD5(payload) {
		const md5 = cryptoJs.enc.Base64.stringify(cryptoJs.MD5(payload));
		return md5;
	}

	generateSignatureForSolis(apiSecret, contentMD5, contentType, date, apiPath) {
		const canonicalString =
			'POST' + '\n' + contentMD5 + '\n' + contentType + '\n' + date + '\n' + apiPath;
		const sign = cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA1(canonicalString, apiSecret));

		return sign;
	}
}

module.exports = new SecuredUtils();
