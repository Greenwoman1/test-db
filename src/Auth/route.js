


const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post("/refresh", controller.refresh); 


module.exports = router;
