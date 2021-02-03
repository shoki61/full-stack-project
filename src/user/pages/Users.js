import React from 'react';

import UsersList from '../components/UsersList';

const Users = () =>{
    const USERS = [
        {
            id: 'u1',
            name: 'Sohrat Jumadurdyyev',
            image: 'https://avatars.githubusercontent.com/u/54548249?s=400&u=5ea4ec16b1c673e5c45d92fbca2f74d6b00d7447&v=4',
            places: 3
        }
    ];
    return <UsersList items={USERS}/>;
};

export default Users;