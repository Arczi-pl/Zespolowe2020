import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Home from './components/Home';
import Register from './components/Register';
import Main from './components/Main';
import NoLogin from './components/NoLogin';
import P2PSend from './components/P2PSend';
import P2PReceive from './components/P2PReceive';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/main" component={Main} />
          <Route path="/nologin" component={NoLogin} />
          <Route path="/p2p_send" component={P2PSend} />
          <Route path="/p2p_receive" component={P2PReceive} />

        </div>
      </Router>
    );
  }
}


export default App;
