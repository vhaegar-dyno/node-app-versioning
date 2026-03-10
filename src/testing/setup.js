const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const logger = require('@logger');

class TestSetup {
	constructor() {
		this.mongoServer = null;
	}

	static async connectDb(uri) {
		try {
			await mongoose.connect(uri, {
				connectTimeoutMS: 30000,
				socketTimeoutMS: 45000,
			});
			logger.info('Mongodb Memory Server Started.');
		} catch (err) {
			console.error(`Connection failed with mongodb: ${err.message || JSON.stringify(err)}`);
		}
	}

	static async globalSetup() {
		logger.info('\nStarting Mongodb memory server for testing...');
		this.mongoServer = await MongoMemoryServer.create();

		const MONGO_URI = this.mongoServer.getUri();
		process.env.__DATABASE_URL = MONGO_URI;

		await this.connectDb(MONGO_URI);
	}

	static async disconnectDb() {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
		await mongoose.disconnect();
		await this.mongoServer.stop();
	}
}

module.exports = TestSetup;
