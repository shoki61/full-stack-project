const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/users-controllers');


router.get('/', userControllers.getUsers);

router.post('/signup', userControllers.singup);

router.post('/login', userControllers.login);

module.exports = router;