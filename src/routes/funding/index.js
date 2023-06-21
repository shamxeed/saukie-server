const express = require('express');

const router = express.Router();

router.get('/automated', (req, res) => res.send('Hi from automated funding!!'));

module.exports = router;
