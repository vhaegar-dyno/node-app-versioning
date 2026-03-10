const mongoose = require('mongoose');
const Logger = require('@logger');

class FixtureService {
	constructor(logger = Logger) {
		this.logger = logger;
	}

	async importFixtures(fixtures = []) {
		process.env.FIXTURE_ENV = 'true';
		const fixturesLoaded = new Map();

		this.logger.debug('Clearing database');
		await this.clearDatabase();

		for (const fixture of fixtures) {
			await this.import(fixture, fixtures, fixturesLoaded);
		}
	}

	async clearDatabase() {
		const collections = await mongoose.connection.db.listCollections().toArray();
		for (const collection of collections) {
			await mongoose.connection.db.dropCollection(collection.name);
		}
	}

	async import(fixture, allFixtures, fixturesLoaded) {
		// check if fixture already loaded, skip it
		if (fixturesLoaded.get(fixture.name)) {
			return Promise.resolve();
		}

		// Load all dependencies before this fixture
		if (fixture.dependsOn && fixture.dependsOn.length > 1) {
			for (const d of fixture.dependsOn) {
				const dependentFixture = allFixtures.find((f) => f.name === d.name);
				if (!dependentFixture)
					throw new Error(`Fixture ${fixture.name} depends on ${d.name}, but it was not found`);

				await this.import(dependentFixture, allFixtures, fixturesLoaded);
			}
		}

		fixturesLoaded.set(fixture.name, true);

		// load the fixture data:
		await fixture.load(mongoose);

		this.logger.debug(`Fixture ${fixture.name} loaded`);
	}
}

module.exports = FixtureService;
