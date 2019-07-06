import React, { useContext, useState } from 'react';
import AuthContext from '../../../contexts/auth_context';
import axios from 'axios';
import { SERVER } from '../../../config';

const Profile = () => {

    const { user, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState({ ...user, profile_image: `${SERVER}/settings/profile_image` });
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setStatus(null);
        console.log(e.target.profile_image.files[0])
        const formData = new FormData();
        formData.append('profile_image', e.target.profile_image.files[0]);
        try {
            const profileData = (await axios.put(`${SERVER}/settings/profile`, userData)).data;
            if (!profileData.status) throw new Error(profileData.message);
            await axios.post(`${SERVER}/settings/profile_image`, formData)
            // if (!profileImageData.status) throw new Error(profileImageData.message);
            setUser(user);
            setStatus(true)
            setMessage(profileData.message);
        } catch (error) {
            setStatus(false);
            setMessage(error.message);
            console.log(error);
        }
    }

    const handleChange = e => {
        // console.log(e.target.files);
        let value = null;
        if (e.target.id === 'profile_image') {
            value = e.target.files.length > 0 ? value = URL.createObjectURL(e.target.files[0]) : '';
            console.log(value)
        } else {
            value = e.target.value;
        }
        setUserData({
            ...userData,
            [e.target.id]: value
        });
    }

    return (
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <div className="row">
                <div className="col-sm-7">
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
                </div>
                <div className="ml-2 col-sm-4">
                    <img src={userData.profile_image} alt="" className="w-100" />
                    <div className="form-group">
                        <label htmlFor="profile_image">Upload profile picture</label>
                        <input type="file" className="form-control-file" id="profile_image" accept="image/png, image/jpg" />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Profile;