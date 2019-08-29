import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home/';
import NoMatch from './components/nomatch';
import AuthContext from './contexts/auth_context';
import axios from 'axios';
import { SERVER } from './config';
import SignedRoutes from './routes/signed_routes';
import UnsignedRoutes from './routes/unsigned_routes';

function App() {

  const { user, setUser } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status, user } = (await axios.get(`${SERVER}/auth/authenticated`)).data;
        if (isMounted) {
          if (status) {
            setUser(user);
          }
          setLoaded(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
    return () => isMounted = false;
  }, [setUser]);


  return loaded && (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <div className="mt-3">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/not_found" component={NoMatch} />
              {
                user ? (
                  <SignedRoutes />
                ) : (
                    <UnsignedRoutes />
                  )
              }
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
