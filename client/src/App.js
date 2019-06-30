import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import { SignIn, SignUp } from './components/auth';
import NoMatch from './components/nomatch';
import AuthContext from './contexts/auth_context';
import axios from 'axios';
import { PORT, SERVER } from './config';

function App() {

  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const { status, user } = (await axios.get(`${SERVER}:${PORT}/auth/authenticated`)).data;
        if (status) {
          setUser(user);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setUser]);


  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/signup' component={SignUp} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
