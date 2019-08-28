import React, { Fragment, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom'
import AuthContext from '../contexts/auth_context';
import Axios from 'axios';
import { SERVER } from '../config';

const Navbar = ({ history }) => {

    const { user, setUser } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            const { status } = (await Axios.get(`${SERVER}/auth/signout`)).data
            if (status) setUser(null);
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Grade View</Link>
                <div className="form-inline my-2 my-lg-0" >
                    {
                        user ? (
                            <Fragment>
                                <Link to='/register/gpa' className="navbar-brand">Register GPA</Link>
                                <Link onClick={handleSignOut} to='#' className="navbar-brand">Sign out</Link>
                                <Link className="navbar-brand" to='/settings/profile'>Settings</Link>
                            </Fragment>
                        ) : (
                                <Fragment>
                                    <Link className="navbar-brand" to="/signup">Sign up</Link>
                                    <Link className="navbar-brand" to="/signin">Sign in</Link>
                                </Fragment>
                            )
                    }

                </div>
            </div>
        </nav >
    );
}

export default withRouter(Navbar);