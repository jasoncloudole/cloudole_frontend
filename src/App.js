import './App.css';
import 'fontsource-roboto';

import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'

import {Elements} from '@stripe/react-stripe-js';
import Home from './pages/Home'
import Login from './pages/Login'
import PrivateRoute from './_components/PrivateRoute';
import PublicRoute from './_components/PublicRoute';
import React from 'react';
import Shopify from './pages/Shopify'
import Signup from './pages/Signup'
import axios from 'axios'
import {loadStripe} from '@stripe/stripe-js';

axios.defaults.baseURL = 'https://us-central1-cloudole-2f23d.cloudfunctions.net/api'
// axios.defaults.baseURL = 'http://localhost:5000/cloudole-2f23d/us-central1/api'
const stripePromise = loadStripe('pk_test_dpjyOGsBaKQFXRYd5gTVoBYL00mtQJMKeo');

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <Router>
          <Switch>
            <PublicRoute exact path="/login" restricted component={Login} />
            <PublicRoute exact path="/signup" restricted component={Signup} />
            <Route exact path="/shopify" component={Shopify} />
            <PrivateRoute path="/" component={Home} />

          </Switch>
        </Router>
      </Elements>
    </div>
  );
}

export default App;
