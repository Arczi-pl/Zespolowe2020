import React from 'react';
import Navbar from './Navbar';
import Transfer from './Transfer';
import About from './About';
import Account from './Account';
import Links from './Links';
import Cookies from 'universal-cookie';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

class Main extends React.Component {
  render() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/main'><Redirect to='/transfer' /></Route>
          <Route path='/account' component={Account} />
          <Route path='/links' component={Links} />
          <Route path='/transfer' component={Transfer} />
          <Route path='/about' component={About} />
          <Route path='/logout' render={() => {logout()} } />
        </Switch>
      </Router>
  </>
  );
  }
}

function logout(){
    const cookies = new Cookies();
    cookies.set("access_token", "None");
    cookies.set("refresh_token", "None");
    let path = "/"; 
    window.location.href=path;
}

export default Main;
