const express = require('express');

const controllers = require('../../controllers/transaction');
const { auth } = require('../../middlewares');

const router = express.Router();

router.get('/:type/:cursor?', auth, controllers.get);

module.exports = router;
