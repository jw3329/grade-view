import React from 'react';
import Settings from '../components/settings/settings';
import RegisterGPA from '../components/register_gpa';
import Dashboard from '../components/home/dashboard';
import { Route, Switch } from 'react-router-dom';


const SignedRoutes = () => {
    return (
        <Switch>
            <Route path="/settings" component={Settings} />
            <Route path="/register/gpa" component={RegisterGPA} />
            <Route path="/:username" component={Dashboard} />
        </Switch>
    );
}

export default SignedRoutes;