import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Home from './components/Home';
import Register from './components/Register';
import Main from './components/Main';
import P2P from './components/P2P';
import P2PSend from './components/P2PSend';
import P2PReceive from './components/P2PReceive';
import About from './components/About';
import DownloadShared from './components/DownloadShared.js';

class App extends Component {
  render() {
    return (
      <Router>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/p2p" component={P2P} />
          <Route path="/p2p_send" component={P2PSend} />
          <Route path="/p2p_receive" component={P2PReceive} />
          <Route path='/main' component={Main} />
          <Route path='/download_shared/:id?/:file?' component={DownloadShared} />
      </Router>
    );
  }
}


export default App;
