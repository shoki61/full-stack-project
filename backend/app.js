const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places',placesRoutes);

app.use('/api/users',usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Page not found!', 404);
    throw error;
});

app.use((error,req, res, next)  => {
    if(req.file){
        fs.unlink(req.file.path, error => {
            console.log(error);
        });
    };
    if(res.headerSent) return next(error);

    res.status(error.code || 500).json({error: error.message || 'Not Found'});
});

mongoose.connect('mongodb+srv://manu:murtishoki61@cluster0.jrili.mongodb.net/mern?retryWrites=true&w=majority')
.then(()=>{
    app.listen(5000);
}).catch(error => {
    console.log(error);
});
