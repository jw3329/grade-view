import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import { SignIn, SignUp } from './components/auth';
import NoMatch from './components/nomatch';
import AuthContext from './contexts/auth_context';
import axios from 'axios';
import { SERVER } from './config';
import Settings from './components/settings/settings';
import RegisterGPA from './components/register_gpa';

function App() {

  const { setUser } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status, user } = (await axios.get(`${SERVER}/auth/authenticated`)).data;
        if (status) {
          setUser(user);
        }
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUser]);


  return loaded && (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <div className="mt-3">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/signin' component={SignIn} />
              <Route exact path='/signup' component={SignUp} />
              <Route path='/settings' component={Settings} />
              <Route path='/register/gpa' component={RegisterGPA} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
