import React, { useContext } from 'react';
import AuthContext from '../../contexts/auth_context';
import Signed from './signed';
import Unsigned from './unsigned';

const Home = () => {

    const { user } = useContext(AuthContext);
    return (
        user ?
            (
                <Signed />
            ) : (
                <Unsigned />
            )
    )
}

export default Home;