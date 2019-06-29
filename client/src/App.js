import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import { SignIn, SignUp } from './components/auth';
import NoMatch from './components/nomatch';

function App() {
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
