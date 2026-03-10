class FixtureReferenceService {
	static references = new Map();

	static addReference(name, entity) {
		this.references.set(name, entity);
	}

	static getReference(name) {
		const ref = this.references.get(name);
		if (ref === undefined) {
			throw new Error(`Entity not found: ${name}`);
		}

		return ref;
	}

	static getAllReferences() {
		return this.references;
	}
}

module.exports = FixtureReferenceService;
