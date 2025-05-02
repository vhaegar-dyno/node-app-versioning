const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../middleware/apiError');

class JwtUtils {
	static generateToken(user) {
		try {
			const expiresIn = '7d';
			const payload = {
				id: user._id,
				username: user.username,
			};
			const token = jwt.sign(payload, config.jwtKey, {
				expiresIn: expiresIn,
			});
			return token;
		} catch (err) {
			throw ApiError.internal(err);
		}
	}

	static verifyToken(token) {
		let result = null;
		jwt.verify(token, config.jwtKey, (err, tokenData) => {
			if (err) throw ApiError.notAuthorized('Unauthorized request');
			result = tokenData;
		});

		return result;
	}
}

module.exports = JwtUtils;
