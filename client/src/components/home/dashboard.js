import React, { useEffect, useState } from 'react';
import Signed from './signed';
import Axios from 'axios';
import { SERVER } from '../../config';

const Dashboard = ({ match }) => {
    const username = match.params.username;
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            const { user } = (await Axios.post(`${SERVER}/api/find_user`, { username })).data;
            setUser(user);
        })();
    }, [username]);

    return <Signed user={user} />;
}

export default Dashboard;