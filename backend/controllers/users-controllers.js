const {v4: uuid} = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(e) {
        const error = new HttpError('Fetching users failed, please try again', 500);
        return next(error);
    };
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const singup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(`Invalid ${errors.errors[0].param}, please check your data!`, 422));
    };
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(e) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    };
    if(existingUser){
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    };
    const createdUser = new User({
        name,
        email,
        password,
        image: 'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        places: []
    });
    try{
        await createdUser.save();
    } catch(e){
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    };
    res.status(201).json({user: createdUser.toObject({ getters: true })});
};

const login = async (req, res, next) => {
    const { email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(e) {
        const error = new HttpError('Loging in failed, please try again later.', 500);
        return next(error);
    };

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    };

    res.json({message: 'Logged in'});
};


exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;