const { Redis } = require('ioredis');
const config = require('@config/config.js');
const logger = require('@logger');

let hasLoggedError = false;
const RedisClient = Redis.createClient({
	host: config.redis.host || 'redis',
	port: config.redis.port || 6379,
	maxRetriesPerRequest: null,
	enableReadyCheck: false,
	retryStrategy(times) {
		if (times > 3600) return null; // stop after 1 hour

		// Exponential backoff: 100ms, 200ms, 400ms, 800ms ... up to 30s
		const delay = Math.min(100 * Math.pow(2, times), 30000);
		return delay;
	},
});

RedisClient.on('connecting', () => logger.info('📡 Attempting to connect to Redis server...'));
RedisClient.on('reconnecting', () =>
	logger.debug('♻️ Redis connection lost — attempting to reconnect...')
);
RedisClient.on('ready', () => {
	logger.info('✅ Redis connection established successfully');
	if (hasLoggedError) {
		logger.info('✅ Redis reconnected, error logging reset');
		hasLoggedError = false; // allow logging next outage
	}
});
RedisClient.on('connect', () => logger.info('🚀 Redis up and running — caching layer active'));
RedisClient.on('error', (err) => {
	if (!hasLoggedError) logger.error(`💥 Redis failure, droping message: ${err.message}`);
	hasLoggedError = true;
});
RedisClient.on('close', () => logger.info('⭕ Redis connection closed!'));

module.exports = RedisClient;
