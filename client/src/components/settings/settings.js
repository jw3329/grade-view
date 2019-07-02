import React, { useContext } from 'react';
import SettingNav from './setting_nav';
import SettingComponent from './setting_component';
import AuthContext from '../../contexts/auth_context';
import { Redirect } from 'react-router-dom';

const Settings = ({ history }) => {

    const { user } = useContext(AuthContext);
    const subCategory = history.location.pathname.substring('/settings/'.length);
    if (!user) return <Redirect to='/' />;
    if (!subCategory) return <Redirect to='/settings/profile' />;

    return (
        <div className="setting-page">
            <div className="row">
                <div className="nav col-sm-2">
                    <SettingNav />
                </div>
                <div className="offset-sm-1 component col-sm-9">
                    <SettingComponent subCategory={subCategory} />
                </div>
            </div>
        </div>
    );
}

export default Settings;