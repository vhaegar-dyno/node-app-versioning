const logger = require('../../config/logger');
const KafkaConsumer = require('../consumer');

const processIotMeter = async (message) => {
	logger.info('Logic to parse raw data of data logger for MFM', message);
};

const meterConsumer = new KafkaConsumer('iot-meters', 'meter-group');

async function init() {
	await meterConsumer.connect();
	await meterConsumer.startProcessing(processIotMeter);
}

init().catch((err) => logger.error(`Error in parsing mfm data: ${err.message || err}`));
