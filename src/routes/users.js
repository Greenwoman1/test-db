var express = require('express');
var router = express.Router();

const controller = require('../controllers/userController');

router.get('/', async function (req, res) {


    const data =  await controller.getUsers();

    console.log(data);
    res.render('users', { title: 'Users', users: data });

});

router.post('/add', controller.createUser);

module.exports = router;