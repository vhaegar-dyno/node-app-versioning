/* eslint-disable no-undef */
const { http, passthrough } = require('msw');
const { setupServer } = require('msw/node');
const app = require('../app');
const request = require('supertest');
const { afterAll } = require('@jest/globals');
const JwtUtils = require('@utils/jwtUtils');
const TestSetup = require('./setup');
const FixtureService = require('./fixtures/fixture.service');
const FixtureReferenceService = require('./fixtures/fixtureReference.service');
const { generateFormData } = require('./formData');
const RedisClient = require('@clients/redisClient');

class TestSuite extends FixtureService {
	constructor(fixtures) {
		super();
		this.app = app;
		this.fixtures = fixtures;
		this.references = FixtureReferenceService.getAllReferences();
		this.mockHttpServer = setupServer(
			http.get('*', () => passthrough()),
			http.post('*', () => passthrough())
		);

		beforeAll(async () => {
			await TestSetup.globalSetup();
			process.env.__MONGO_TEST_COUNT = (process.env.__MONGO_TEST_COUNT || '1') + 1;

			const dbName =
				'test_' + process.env.__MONGO_TEST_COUNT + '_' + Math.random().toString(36).substring(2);
			process.env.DATABASE_NAME = dbName;

			const uri = process.env.__DATABASE_URL;
			process.env.DATABASE_URL = uri;

			// Adding user fixture default for authentications:
			// this.fixtures = [UserFixture, ...this.fixtures];
			this.fixtures = [...this.fixtures];
			this.mockHttpServer.listen({
				onUnhandledRequest: 'bypass',
			});
		});

		beforeEach(async () => {
			await this.importFixtures(this.fixtures);
		});

		afterEach(async () => {
			jest.clearAllMocks();
		});
		afterAll(async () => {
			await TestSetup.disconnectDb();
			this.mockHttpServer.close();
			await RedisClient.quit();
		});
	}

	getReference(name) {
		return this.references.get(name);
	}

	async exec(method, url, options = {}) {
		const server = request(this.app);

		// using the specified HTTP method dynamically
		let requestBuilder = server[method.toLowerCase()]('/api' + url);

		if (options.headers) {
			requestBuilder = requestBuilder.set(options.headers);
		}
		if (options.query) {
			requestBuilder = requestBuilder.query(options.query);
		}
		if (options.data && !['GET', 'DELETE'].includes(method) && !options.files) {
			requestBuilder = requestBuilder.send(options.data);
		}
		if (options.files) {
			// setting headers as form-data:
			requestBuilder = requestBuilder.set('Content-Type', 'multipart/form-data');

			// adding files to the request:
			for (const file of options.files) {
				requestBuilder = requestBuilder.attach(file.fieldName, file.filePath);
			}
			if (options.data) {
				// requestBuilder = requestBuilder.field(options.data);
				requestBuilder = generateFormData(requestBuilder, options.data);
			}
		}

		const response = await requestBuilder;
		return response;
	}

	async generateTestToken(username) {
		const payload = {
			username: username || 'superadmin@holmium.com',
		};

		const token = JwtUtils.generateToken(payload);
		return token;
	}
}

module.exports = TestSuite;
