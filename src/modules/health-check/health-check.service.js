const config = require('../../config/config');

class HealthCheckServices {
	constructor() {
		this.os = require('os');
	}
	getSystemHealth() {
		return {
			timestamp: new Date().toISOString(),
			system: this.systemHealth(),
			application: this.applicationHealth(),
		};
	}

	systemHealth() {
		return {
			cpuUsage: this.os.loadavg(), // 1, 5 and 15 minutes of system's avg load
			totalMemory: `${(this.os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
			freeMemory: `${(this.os.freemem() / 1024 / 1024).toFixed(2)} MB`,
		};
	}

	applicationHealth() {
		return {
			env: config.env,
			upTime: `${process.uptime().toFixed(2)} seconds`,
			memoryUsage: {
				heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
				heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
			},
		};
	}
}

module.exports = new HealthCheckServices();
