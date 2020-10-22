import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shopify from './pages/Shopify'
import axios from 'axios'
import PrivateRoute from './_components/PrivateRoute';

axios.defaults.baseURL = 'https://us-central1-cloudole-2f23d.cloudfunctions.net/api'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/shopify" component={Shopify} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
