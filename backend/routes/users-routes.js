const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 

const userControllers = require('../controllers/users-controllers');


router.get('/', userControllers.getUsers);

router.post('/signup',[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], userControllers.singup);

router.post('/login', userControllers.login);

module.exports = router;