const { verifyUser } = require('./auth.controller');

const router = require('express').Router();

router.get('/', verifyUser);

module.exports = router;
