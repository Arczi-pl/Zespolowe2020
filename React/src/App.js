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

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
        </div>
      </Router>
    );
  }
}


export default App;
