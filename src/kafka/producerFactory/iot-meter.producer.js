const kafka = require('../client');

class MeterProducer {
	constructor(kafkaClient = kafka) {
		this.logger = require('../../config/logger');
		this.kafkaClient = kafkaClient;
		this.producer = this.kafkaClient.producer({
			acks: 'all',
			retry: 5, // Retry if a broker is down
		});
	}

	async connect() {
		await this.producer.connect();
		this.logger.info('Meter producer connected to Kafka');
	}

	async produceMessage(message) {
		await this.producer.send({
			topic: 'iot-meters',
			messages: [{ key: 'mfm', value: JSON.stringify(message) }],
			acks: -1,
		});
		this.logger.info(`Produced message to topic "iot-meters": ${JSON.stringify(message)}`);
	}

	async disconnect() {
		await this.producer.disconnect();
		this.logger.info('Producer disconnected to Kafka');
	}
}

const meterProducerInstance = new MeterProducer();
meterProducerInstance.connect();
module.exports = meterProducerInstance;
