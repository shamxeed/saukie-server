const express = require('express');

const controllers = require('../../controllers/user');
const { auth } = require('../../middlewares/index');

const router = express.Router();

router.get('/me', auth, controllers.me);

module.exports = router;
