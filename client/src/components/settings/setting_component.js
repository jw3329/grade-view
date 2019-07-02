import React from 'react';
import Profile from './setting_components/profile';
import Account from './setting_components/account';

const SettingComponent = ({ subCategory }) => {
    const componentMap = {
        profile: <Profile />,
        account: <Account />
    }
    return componentMap[subCategory];
}

export default SettingComponent;