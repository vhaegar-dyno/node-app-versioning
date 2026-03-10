function generateCurl(method, config) {
	const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;

	let curl = [`curl -X ${method} '${url}'`];

	// Headers
	if (config.headers) {
		for (const [key, value] of Object.entries(config.headers)) {
			if (value !== undefined) {
				curl.push(`-H '${key}: ${value}'`);
			}
		}
	}

	// Body
	if (config.data) {
		const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
		curl.push(`--data '${data}'`);
	}

	return curl.join(' \\\n  ');
}

module.exports = {
	generateCurl,
};
