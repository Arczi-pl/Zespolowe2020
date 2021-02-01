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
  if(inSession()){ // dodatkowe zabepieczenie 
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
  else {
    return (<> </>);
  }
  }
}

function logout(){
    const cookies = new Cookies();
    cookies.set("access_token", "None");
    cookies.set("refresh_token", "None");
    let path = "/"; 
    window.location.href=path;
}

function inSession(){
  var token = getCookie("access_token");
  if(token == "None" || token == ""){
    return false
  } 
  else {
    return true
  }
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default Main;
