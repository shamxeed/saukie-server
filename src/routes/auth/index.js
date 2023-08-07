const express = require('express');

const controllers = require('../../controllers/auth');

const router = express.Router();

router.post('/sign-in', controllers.signIn);

module.exports = router;
