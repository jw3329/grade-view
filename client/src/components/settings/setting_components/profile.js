import React, { useContext, useState } from 'react';
import AuthContext from '../../../contexts/auth_context';
import axios from 'axios';
import { SERVER, PORT } from '../../../config';

const Profile = () => {

    const { user, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(user);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { status, message, user } = (await axios.put(`${SERVER}:${PORT}/settings/profile`, userData)).data;
            setStatus(status);
            setMessage(message);
            setUser(user);
            if (!status) throw new Error(message);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value
        });
    }

    return (
        <div className="row">
            <div className="col-sm-7">
                <form onSubmit={handleSubmit} onChange={handleChange}>
                    <div className="form-group">
                        <label htmlFor="first_name">First name</label>
                        <input type="text" className="form-control" id="first_name" placeholder="First name" required defaultValue={userData.first_name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last name</label>
                        <input type="text" className="form-control" id="last_name" placeholder="Last name" required defaultValue={userData.last_name} />
                    </div>
                    <label htmlFor="bio">Bio</label>
                    <textarea className="form-control" id='bio' placeholder="Enter bio" defaultValue={userData.bio} />
                    <div className="form-group">
                        <label htmlFor="url">URL</label>
                        <input type="text" className="form-control" id="url" placeholder="url" defaultValue={userData.url} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input type="text" className="form-control" id="company" placeholder="Company" defaultValue={userData.company} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input type="text" className="form-control" id="location" placeholder="Location" defaultValue={userData.location} />
                    </div>
                    {
                        message && (
                            <div className={"alert alert-" + (status ? 'success' : 'danger')}>
                                {message}
                            </div>
                        )
                    }
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            <div className="ml-2 col-sm-4">
                Profile picture here
            </div>
        </div>
    );
}

export default Profile;