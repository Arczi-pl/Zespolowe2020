import React from 'react';
import Navbar from './Navbar';
import Upload from './Upload';
import About from './About';
import Account from './Account';
import Links from './Links';
import P2P from './P2P';
import P2PSend from './P2PSend';
import P2PReceive from './P2PReceive';
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
              <Route path='/main'><Redirect to='/p2p' /></Route>
              <Route path='/p2p' component={P2P} />
              <Route path='/p2p_send' component={P2PSend} />
              <Route path='/p2p_receive' component={P2PReceive} />
              <Route path='/account' component={Account} />
              <Route path='/links' component={Links} />
              <Route path='/upload' component={Upload} />
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
