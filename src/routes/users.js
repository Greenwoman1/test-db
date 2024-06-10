var express = require('express');
var router = express.Router();

const controller = require('../controllers/userController');

router.get('/', controller.getUsers);

router.post('/add', controller.createUser);

router.delete('/delete/:id', controller.deleteUser);

router.get('/:id', controller.getUserById);

router.post('/update/:id', controller.updateUser);

module.exports = router;
