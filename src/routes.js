const auth = require('./middleware/auth');
const healthCheckRoutes = require('./modules/health-check/health-check.routes.js');
const userRoutes = require('./modules/core/user/user.routes.js');
const authRoutes = require('./modules/auth/auth.routes.js');

const ENDPOINT = '/api';
const routes = (app) => {
	app.use(ENDPOINT + '/health', healthCheckRoutes);
	app.use(ENDPOINT + '/user', userRoutes);
	app.use(ENDPOINT + '/auth', auth, authRoutes);
};

module.exports = routes;
