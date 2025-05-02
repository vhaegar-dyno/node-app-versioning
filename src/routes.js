const auth = require('./middleware/auth');
const healthCheckRoutes = require('./modules/health-check/health-check.routes.js');
const userRoutes = require('./modules/core/user/user.routes.js');
const authRoutes = require('./modules/auth/auth.routes.js');

const ENDPOINT = '/api';
const routes = (app) => {
	app.use(ENDPOINT + '/health', healthCheckRoutes);
	app.use(ENDPOINT + '/user', userRoutes);
	app.use(ENDPOINT + '/auth', auth, authRoutes);
	app.use(ENDPOINT + '/v2', (req, res) => {
		try {
			return res.status(200).json({ status: true, message: 'Version: v2.0.0 is running' });
		} catch (err) {
			return res
				.status(500)
				.json({ status: false, message: err.message || 'Something went wrong' });
		}
	});
};

module.exports = routes;
