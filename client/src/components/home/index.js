import React, { useContext } from 'react';
import AuthContext from '../../contexts/auth_context';
import Unsigned from './unsigned';
import { Redirect } from 'react-router-dom';

const Home = () => {

    const { user } = useContext(AuthContext);

    if (user) return <Redirect to={`/${user.username}`} />;

    return (
        <Unsigned />
    )
}

export default Home;