const config = require('../config/config');

module.exports = {
	SUPER_ADMIN_USERNAME: config.home.superAdminUsername,
	HOME_USERTYPES: ['superAdmin', 'configuration', 'admin'],
	HOME_ERROR_MESSAGE: 'Please Contact to Holmium Technologies !!',
	HOME_NAME: 'Holmium Technologies Pvt. Ltd.',
	HOME_LOGO: 'https://www.holmiumtechnologies.com/solarlogiq_v2/logo/logo.svg',
	HOME_CONTACTS: {
		'isActive': true,
		'details': [
			{
				'isActive': true,
				'name': 'Mr Mayank Gupta',
				'role': 'vendor',
				'mobileNo': null,
				'emailId': 'info@holmiumtechnologies.com',
			},
			{
				'isActive': true,
				'name': 'Mr Devvrat Aggrawal',
				'role': 'vendor',
				'mobileNo': null,
				'emailId': 'devvrat.a@holmiumtechnologies.com',
			},
			{
				'isActive': true,
				'name': 'Mr Abhishek Goel ',
				'role': 'vendor',
				'mobileNo': null,
				'emailId': 'abhishek.g@holmiumtechnologies.com',
			},
		],
	},
};
