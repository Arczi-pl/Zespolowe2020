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

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/main" component={Main} />

        </div>
      </Router>
    );
  }
}


export default App;
