const kafka = require('../client');

class InverterProducer {
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
		this.logger.info('Inverter producer connected to Kafka');
	}

	async produceMessage(key, message) {
		await this.producer.send({
			topic: 'iot-inverters',
			messages: [
				{
					headers: {},
					key,
					value: JSON.stringify(message),
					partition: key === 'stringinverter' ? 0 : 1,
				},
			],
			acks: -1,
		});
		this.logger.info(`Produced message to topic "iot-inverters": ${JSON.stringify(message)}`);
	}

	async disconnect() {
		await this.producer.disconnect();
		this.logger.info('Inverter producer disconnected to Kafka');
	}
}

const inverterProducerInstance = new InverterProducer();
inverterProducerInstance.connect();
module.exports = inverterProducerInstance;
