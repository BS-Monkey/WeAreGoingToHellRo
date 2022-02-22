const express = require('express');
const { loginUser, signupUser, logoutUser } = require('../controllers/auth');
const withIp = require('../middleware/withIp');

const router = express.Router();

router.post('/signup', withIp, signupUser);
router.post('/login', withIp, loginUser);
router.post('/logout', logoutUser);

module.exports = router;
