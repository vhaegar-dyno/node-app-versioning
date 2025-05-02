const config = require('../config/config');

module.exports = {
	SUPER_ADMIN_USERNAME: config.home.superAdminUsername,
	HOME_USERTYPES: ['superAdmin', 'configuration', 'admin'],
	HOLME_ERROR_MESSAGE: 'Please Contact to Holmium Technologies !!',
};
