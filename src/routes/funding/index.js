const express = require('express');

const controllers = require('../../controllers/funding');

const router = express.Router();

router.post('/automated/vpay', controllers.vpay);

router.post('/automated/monnify', controllers.monnify);

module.exports = router;
