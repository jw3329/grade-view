import React, { useEffect, useState, Fragment, useContext } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';
import AuthContext from '../../contexts/auth_context';
import { Link } from 'react-router-dom';


const Signed = ({ user }) => {

    const { user: currentUser } = useContext(AuthContext);
    const [gpas, setGpas] = useState([]);
    const [following, setFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);

    useEffect(() => {
        let isMounted = true;
        try {
            if (user) {
                Axios.post(`${SERVER}/api/gpa`, { user })
                    .then(res => res.data)
                    .then(({ status, message, info }) => {
                        if (!status) throw new Error(message);
                        isMounted && setGpas(info.reverse().map(({ course, course_number, gpa }, index) => <Fragment key={index}>{createCard(course, course_number, gpa)}</Fragment>));
                    });
                Axios.post(`${SERVER}/api/get_followers`, {
                    'username': user.username
                }).then(res => res.data).then(({ status, followers, message }) => {
                    if (!status) throw new Error(message);
                    isMounted && setFollowers([...followers]);
                });
                Axios.post(`${SERVER}/api/get_following_users`, {
                    'username': user.username
                }).then(res => res.data).then(({ status, following_users, message }) => {
                    if (!status) throw new Error(message);
                    isMounted && setFollowingUsers([...following_users]);
                });
            }
        } catch (error) {
            console.log(error);
        }
        return () => isMounted = false;
    }, [user]);

    useEffect(() => {
        if (followers.includes(currentUser.username)) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [followers, currentUser]);


    const createCard = (course, courseNumber, gpa) => (
        <div className="card mt-3">
            <div className="card-body">
                <h5 className="card-title">{course}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Course number: {courseNumber}</h6>
                <p className="card-text">GPA: {Number(gpa).toFixed(2)} / 4.00</p>
            </div>
        </div>
    )

    const handleFollow = async () => {
        try {
            const { status, message } = (await Axios.post(`${SERVER}/api/follow`, {
                'destination_username': user.username
            })).data;
            if (!status) throw new Error(message);
            // if the user was following, unfollow the user
            if (following) {
                setFollowers(followers => followers.filter(follower => follower !== currentUser.username));
            } else {
                // include current username
                setFollowers(followers => [...followers, currentUser.username]);
            }
            setFollowing(!following);
        } catch (error) {
            console.log(error);
        }
    }

    const createLink = username => <Link key={username} to={`/${username}`}>{username}</Link>

    return (
        <Fragment>
            <div className="d-block p-2">
                <div className="d-flex justify-content-end">
                    {
                        currentUser.username !== user.username && (
                            following ? (
                                <button onClick={handleFollow} className="btn btn-light">Unfollow</button>
                            ) : (
                                    <button onClick={handleFollow} className="btn btn-primary">Follow</button>
                                )
                        )
                    }
                </div>
            </div>

            <div className="row">
                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center">Registered GPA</h1>
                            {gpas}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center">Profile</h1>
                            {user.profile_image && <img src={`${SERVER}/api/profile_image/${user.profile_image}`} alt="" className="w-100" />}
                            {user.username && <p>Username: {`${user.username}`}</p>}
                            {user.first_name && user.last_name && <p>Name: {`${user.first_name} ${user.last_name}`}</p>}
                            {user.bio && <p>Bio: {user.bio}</p>}
                            {user.url && <p>URL: {user.url}</p>}
                            {user.company && <p>Company: {user.company}</p>}
                            {user.location && <p>Location: {user.location}</p>}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">Followers</div>
                                <div className="text-center">
                                    <p>{followers.map(follower => createLink(follower))}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-body">Following</div>
                                <div className="text-center">
                                    <p>{followingUsers.map(followingUser => createLink(followingUser))}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Signed;