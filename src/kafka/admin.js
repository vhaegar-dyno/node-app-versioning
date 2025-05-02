const logger = require('../config/logger');
const kafka = require('./client');

async function init() {
	const admin = kafka.admin();
	admin.connect();
	logger.infor('Admin connected to kafka successfully');

	// creating topics:
	await admin.createTopics({
		topics: [
			{ topic: 'iot-inverters', numPartitions: 2 },
			{ topic: 'iot-meters', numPartitions: 2 },
		],
	});
}

init();
