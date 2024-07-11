
const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/', controller.setBalance);
router.get('/:userId', controller.getBalance);


module.exports = router;
