async function tearDown(mongodbMemoryServer) {
	await mongodbMemoryServer.stop();
}

module.exports = tearDown;
