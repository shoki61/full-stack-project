const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    if (!place){
        throw new HttpError('Not found.', 404);
    };

    res.json({place});
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);

    if (!places || places.length === 0){
        return next(new HttpError('Not found.', 404));
    };

    res.json({places});
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

  const createdPlace = {
      id: uuid(),
      title,
      description,
      address,
      location: coordinates,
      creator
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({place: createdPlace});
};

const getAllPlaces = (req, res, next) => {
    res.status(200).json({places: DUMMY_PLACES});
};

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data!', 422);
    };

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Not found.', 404);
    };

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.getAllPlaces = getAllPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;