const logger = require('@config/logger');

const sleep = async (ms = 2000, log = true) => {
	return new Promise((resolve) => {
		if (log) logger.info(`Sleeping for ${ms / 1000} seconds 😴`);
		setTimeout(resolve, ms);
	});
};

module.exports = sleep;
