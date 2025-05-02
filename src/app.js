const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('./config/cors');
const routes = require('./routes');
const morgan = require('./config/morgan');
const { rateLimiter } = require('./middleware/rateLimit');
const { connectionTimeout } = require('./middleware/connectionTimeout');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan.successRequestHandler);
app.use(morgan.errorRequestHandler);
app.use(helmet());
app.use(cors);
app.use(rateLimiter);
app.use(connectionTimeout);

// initializing routes
routes(app);

module.exports = app;
