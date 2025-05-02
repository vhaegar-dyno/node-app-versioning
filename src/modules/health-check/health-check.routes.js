const { checkSystemHealth } = require('./health-check.controller');

const router = require('express').Router();

router.get('/', checkSystemHealth);

module.exports = router;
