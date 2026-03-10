// PM2 configuration
module.exports = {
	apps: [
		{
			name: 'SolarTree-DEV',
			script: './src/server.js',
			env_development: {
				NODE_ENV: 'development',
				ENV: 'development',
			},
		},
		{
			name: 'SolarTree-PROD',
			script: './src/server.js',
			env_production: {
				NODE_ENV: 'production',
				ENV: 'production',
			},
		},
	],
};
