const express = require('express');
const multer = require('multer');
const userController = require('./userController');

const upload = multer();

module.exports = (io) => {
  const router = express.Router();

  router.post('/', upload.none(), (req, res) => userController.createUser(req, res, io));
  router.get('/', (req, res) => userController.getUsers(req, res));

  router.get('/orders/:userId', (req, res) => userController.getOrderDetailsForUser(req, res, io));
  router.get('/waitersAvilable', (req, res) => userController.isAnyWaiterAvilable(req, res, io));

  router.get('/:id', (req, res) => userController.getUserById(req, res));
  router.put('/:id', (req, res) => userController.updateUser(req, res, io));
  router.delete('/:id', (req, res) => userController.deleteUser(req, res, io));

  return router;
};
