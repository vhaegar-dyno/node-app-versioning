function generateFormData(requestBuilder, data, parentKey = '') {
	if (!data) return requestBuilder;

	for (const [key, value] of Object.entries(data)) {
		const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (typeof item === 'object') {
					// Use full index-based keys for nested array items
					const index = value.indexOf(item);
					generateFormData(requestBuilder, item, `${fieldKey}[${index}]`);
				} else {
					requestBuilder = requestBuilder.field(`${fieldKey}[]`, item);
				}
			});
		} else if (typeof value === 'object') {
			generateFormData(requestBuilder, value, fieldKey);
		} else {
			requestBuilder = requestBuilder.field(fieldKey, value);
		}
	}

	return requestBuilder;
}

module.exports = {
	generateFormData,
};
