const logger = require('../../config/logger');
const KafkaConsumer = require('../consumer');

const processCentralizedInverter = async (message) => {
	logger.info('Logic to parse raw data of data logger for Inverter', message);
};

const centralizedInverterConsumer = new KafkaConsumer('iot-inverters', 'inverter-group', 1);

async function init() {
	await centralizedInverterConsumer.connect();
	await centralizedInverterConsumer.startProcessing(processCentralizedInverter);
}

init().catch((err) => logger.error(`Error in parsing mfm data: ${err.message || err}`));
