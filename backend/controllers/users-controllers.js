const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch(error) {
        const error = new HttpError('Coult not create user, please try again.', 500);
        return next(error);
    };

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
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

    if(!existingUser){
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    };

    let isValisPassword = false;
    try {
        isValisPassword = bcrypt.compare(password, existingUser.password);
    } catch(error) {
        const error  = new HttpError('Coult not log you in, please check your credentials and try egain.', 500);
        return next(error);
    };

    if(!isValisPassword){
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    };

    res.json({message: 'Logged in', user: existingUser.toObject({ getters: true })});
};


exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;