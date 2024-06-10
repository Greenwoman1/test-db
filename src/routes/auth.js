var express = require('express');
var router = express.Router();

const controller = require('../controllers/auth/auth');

router.get('/login', controller.login);

router.post('/register', controller.registerUser);



module.exports = router;
