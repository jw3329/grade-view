import React from 'react';
import { SignIn, SignUp } from '../components/auth/index';
import { Route, Switch } from 'react-router-dom';

const UnsignedRoutes = () => {
    return (
        <Switch>
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
        </Switch>
    );
}

export default UnsignedRoutes;