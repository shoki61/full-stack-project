const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u1'
    },
    {
      id: 'p2',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u2'
    }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
      place = await Place.findById(placeId);
    } catch (e){
      const error = new HttpError('Not found.', 500);
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

    let places;

    try {
      places = await Place.find({ creator:userId });
    } catch(e) {
      const error = new HttpError('Not found.', 500);
      return next(error);
    };

    if (!places || places.length === 0){
        return next(new HttpError('Not found.', 404));
    };

    res.json({places: places.map(place => place.toObject({ getters: true }))});
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    next(HttpError('Invalid inputs passed, please check your data!', 422));
  };

  const { title, description, address, creator } = req.body;

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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    creator
  });

  try{
    await createdPlace.save();
    res.status(201).json({place: createdPlace});
  } catch(e) {
    const error = new HttpError('Creating place failed, please try againg.', 500);
    return next(error);
  };
};

const getAllPlaces = async (req, res, next) => {
  const places = await Place.find({});
  res.status(200).json({places: places});
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data!', 422);
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
      place = Place.findById(placeId);
    } catch(e) {
      const error = new HttpError('Something when wrong could not delete place!', 500);
      return next(error);
    };

    try {
      await place.remove();
    } catch(e) {
      const error = new HttpError('Something when wrong could not delete place!', 500);
      return next(error);
    };
    res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;