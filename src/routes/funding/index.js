const express = require('express');

const controllers = require('../../controllers/funding');

const router = express.Router();

router.post('/automated/vpay', (r, res) =>
  res.send('This route is been temporarily blocked')
);

router.post(
  '/automated/monnify/createAccounts',
  controllers.createMonnifyAccounts
);

router.post('/automated/monnify', controllers.monnify);

module.exports = router;
