const { port, whitelistIP, serverUrl } = require('./config/config');
const app = require('./app');
const logger = require('./config/logger');
const { dbConnect } = require('./config/db');

app.listen(port, whitelistIP, () => {
	logger.info(`🖥️ 🚀  Server is running on process ${process.pid} at port ${port}`);
	logger.info(`Server URL: ${serverUrl}/api`);
	dbConnect();
});
