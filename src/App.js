import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Shopify from './pages/Shopify'
import axios from 'axios'

axios.defaults.baseURL = 'https://us-central1-cloudole-2f23d.cloudfunctions.net/api'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/shopify" component={Shopify} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
