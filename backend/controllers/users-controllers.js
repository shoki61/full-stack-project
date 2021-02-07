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

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const singup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(`Invalid ${errors.errors[0].param}, please check your data!`, 422));
    };
    const { name, email, password, places} = req.body;

    let existingUser;
    try {
        const existingUser = await User.findOne({ email });
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
        places
    });

    try{
        await createdUser.save();
    } catch(e){
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    };
    res.status(201).json({user: createdUser.toObject({ getters: true })});
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