const mongoose = require('mongoose');
const { db } = require('./config');
const logger = require('./logger');

const dbConnect = () => {
	const dbUrl = db.url;
	if (!dbUrl) {
		logger.error('DB URL not set in env file or config.js');
		throw new Error('DB URL not set in env file or config.js');
	}

	let retryCount = 3;
	const connectWithRetry = () => {
		mongoose
			.connect(dbUrl, {
				connectTimeoutMS: 30000,
				socketTimeoutMS: 45000,
			})
			.then(() => logger.info('🛢️  Database connected!'))
			.catch((err) => {
				if (retryCount === 0) {
					logger.error(`❌ FAILED to connect to Database, dropping message: ${err}`);
					process.exit(1);
				}

				logger.info(`🔄 Retry to connect Database failed, attempts left: ${retryCount}`);
				retryCount--;
				setTimeout(connectWithRetry, 5000);
			});
	};

	connectWithRetry();
};

module.exports = { dbConnect };
