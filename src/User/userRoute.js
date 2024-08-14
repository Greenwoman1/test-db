const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);

router.get('/orders/:userId', userController.getOrderDetailsForUser);
router.get('/waitersAvilable', userController.isAnyWaiterAvilable);

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;
