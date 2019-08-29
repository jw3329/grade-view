import React, { useState, useEffect } from 'react';
import Signed from './signed';
import Axios from 'axios';
import { SERVER } from '../../config';
import { Redirect } from 'react-router-dom';

const Dashboard = ({ match }) => {
    const username = match.params.username;
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let unmount = false;
        (async () => {
            const { user } = (await Axios.post(`${SERVER}/api/find_user`, { username })).data;
            if (!unmount) {
                setUser(user);
                setLoaded(true);
            }
        })();
        return () => unmount = true;
    }, [username]);

    if (!loaded) return null;
    return user ? <Signed user={user} /> : <Redirect to="/not_found" />;
}

export default Dashboard;