const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') return next();
    try{
        const token = req.header.authorization.spit(' ')[1];
        if(!token) throw new Error('Authentication failed!');
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch(e) {
        const error = new HttpError('Authentication failed!');
        return next(error);
    };
};