const { loginUser, createUser, getUsersByOrganizationId } = require('./user.controller');
const auth = require('@middlewares/auth');

const router = require('express').Router();

router.post('/login', loginUser);
router.post('/', auth, createUser);
router.get('/org-users', auth, getUsersByOrganizationId);

module.exports = router;
