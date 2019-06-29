import React from 'react';
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Grade View</Link>
                <div className="form-inline my-2 my-lg-0" >
                    <Link className="navbar-brand" to="/signup">Sign up</Link>
                    <Link className="navbar-brand" to="/login">Sign in</Link>
                    <Link className="navbar-brand" to="/logout">Sign out</Link>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;