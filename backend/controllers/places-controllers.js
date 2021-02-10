const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
      place = await Place.findById(placeId);
    } catch (e){
      const error = new HttpError('Not found.', 500);
      return next(error);
    };

    if(place.creator.toString() !== req.userData.userId){
      const error = new HttpError('You are not allowed to edit this place.', 401);
      return next(error);
    };

    if (!place){
      const error = new HttpError('Not found.', 404);
      return next(error);
    };

    res.json({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async(req, res, next) => {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
      userWithPlaces = await User.findById(userId).populated('places');
    } catch(e) {
      const error = new HttpError('Not found.', 500);
      return next(error);
    };

    if (!userWithPlaces || userWithPlaces.places.length === 0){
        return next(new HttpError('Not found.', 404));
    };

    res.json({places: userWithPlaces.places.map(place => place.toObject({ getters: true }))});
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    next(HttpError('Invalid inputs passed, please check your data!', 422));
  };

  const { title, description, address } = req.body;

  let coordinates;

  try{
    coordinates = await getCoordsForAddress(address);
  } catch(error){
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch(e) {
    const error = new HttpError('Creating place fieled, please try again', 500);
    return next(error);
  };

  if(!user){
    const error = new HttpError('Could non find user for provided id.', 404);
    return next(error);
  };

  try{
    const sess = mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session:sess });
    await sess.commitTransaction();
  } catch(e) {
    const error = new HttpError('Creating place failed, please try againg.', 500);
    return next(error);
  };
  res.status(201).json({place: createdPlace});
};

const getAllPlaces = async (req, res, next) => {
  const places = await Place.find({});
  res.status(200).json({places: places});
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return next(new HttpError('Invalid inputs passed, please check your data!', 422));
    };
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
      place = await Place.findById(placeId);
    } catch(e){
      const error = new HttpError('Something when wrong could not update place!',500);
      return next(error);
    };

    place.title = title;
    place.description = description;
    try {
      await place.save();
    } catch(e) {
      const error = new HttpError('Something when wrong could not update place!',500);
      return next(error);
    };
    res.status(200).json({place: place.toObject({ getters: true })});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
      place = await Place.findById(placeId).populated('creator');
    } catch(e) {
      const error = new HttpError('Something when wrong could not delete place!', 500);
      return next(error);
    };

    if(!place){
      const error = new HttpError('Could not find place for this id', 404);
      return next(error);
    };

    if(place.creator.id !== req.userData.userId){
      const error = new HttpError('You are not allowed to delete this place.', 401);
      return next(error);
    };

    const imagePath = place.image;

    try {
      const sess = mongoose.startSession();
      sess.startTransaction();
      await place.remove({ session: sess });
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch(e) {
      const error = new HttpError('Something when wrong could not delete place!', 500);
      return next(error);
    };

    fs.unlink(imagePath, error => consoleçlog(error));

    res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;