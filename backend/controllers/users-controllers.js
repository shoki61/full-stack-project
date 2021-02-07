const {v4: uuid} = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Murat Çepni',
        email: 'test@test.com',
        password: '123456'
    },
    {
        id: 'u2',
        name: 'Sohrat Çepni',
        email: 'test@test.com',
        password: '123456'
    }
];

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const singup = (req, res, next) => {
    const { name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);

    if(hasUser) {
        throw new HttpError('Coult not create user, email adready exists', 422);
    };

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {
    const { email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    
    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('User not found', 401);
    };

    res.json({message: 'Logged in'});
};


exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;