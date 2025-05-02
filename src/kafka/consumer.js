const kafka = require('./client');

class KafkaConsumer {
	constructor(topic, groupId, partition, kafkaClient = kafka) {
		this.logger = require('../config/logger');
		this.kafka = kafkaClient;
		this.topic = topic;
		this.groupId = groupId;
		this.partition = partition;
		this.consumer = this.kafka.consumer({ groupId });
	}

	async connect() {
		await this.consumer.connect();
		if (this.partition >= 0)
			await this.consumer.assign([{ topic: this.topic, partition: this.partition }]);
		else await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
		this.logger.info(`Connected to topic ${this.topic}`);
	}

	async startProcessing(processMessage) {
		await this.consumer.run({
			eachMessage: async ({ message }) => {
				this.logger.info(`Received from ${this.topic}: ${message.value.toString()}`);
				await processMessage(message.value.toString());
			},
		});
	}

	async disconnect() {
		await this.consumer.disconnect();
		this.logger.info(`Consumer for ${this.topic} disconnected.`);
	}
}

module.exports = KafkaConsumer;
