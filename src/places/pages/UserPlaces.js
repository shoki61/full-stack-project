import React from 'react';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageURL: 'https://wallpapercave.com/wp/wp2817695.jpg',
        address: 'Merkez, Ortanköy Köyü Yolu, 53790 Çamlıhemşin/Rize',
        location: {
            lat: 40.8380965,
            lng: 41.3609854
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageURL: 'https://wallpapercave.com/wp/wp2817695.jpg',
        address: 'Merkez, Ortanköy Köyü Yolu, 53790 Çamlıhemşin/Rize',
        location: {
            lat: 40.8380965,
            lng: 41.3609854
        },
        creator: 'u2'
    }
]

const UserPlaces = props => <PlaceList items={DUMMY_PLACES}/>;

export default UserPlaces;