const FixtureReferenceService = require('./fixtureReference.service');

class AbstractFixture {
	constructor() {
		this.dependsOn = [];
		this.name = AbstractFixture.name;
		this.fs = FixtureReferenceService;
	}

	async load() {
		throw new Error('You must implement the load() method in your fixture class');
	}

	addReference(name, entity) {
		this.fs.addReference(name, entity);
	}

	getReference(name) {
		return this.fs.getReference(name);
	}
}

module.exports = AbstractFixture;
