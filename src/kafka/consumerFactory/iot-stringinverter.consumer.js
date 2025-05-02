const logger = require('../../config/logger');
const KafkaConsumer = require('../consumer');

const processStringInverter = async (message) => {
	logger.info('Logic to parse raw data of data logger for String Inverter', message);
};

const stringInverterConsumer = new KafkaConsumer('iot-inverters', 'inverter-group', 0);

async function init() {
	await stringInverterConsumer.connect();
	await stringInverterConsumer.startProcessing(processStringInverter);
}

init().catch((err) => logger.error(`Error in parsing mfm data: ${err.message || err}`));
