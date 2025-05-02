const { Kafka } = require('kafkajs');
const config = require('../config/config');

const kafka = new Kafka({
	clientId: 'solar-logiq',
	brokers: [config.kafka.broker],
	ssl: false,
});

module.exports = kafka;
