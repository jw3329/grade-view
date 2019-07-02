import React from 'react';
import { NavLink } from 'react-router-dom';

const SettingNav = () => {
    return (
        <div className="list-group w-100">
            <NavLink to="/settings/profile" className="list-group-item list-group-item-action">Profile</NavLink>
            <NavLink to="/settings/account" className="list-group-item list-group-item-action">Account</NavLink>
        </div>
    );
}

export default SettingNav;