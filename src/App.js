import React, { Component } from "react";
import "./App.css";
import MainPage from './components/Main'
import UsersPage from './components/users'
import NotFoundPage from './components/nf'
import Gold_coins from './components/coin_type/gold_coins'
//Import all needed Component for this tutorial
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/404" component={NotFoundPage} />
          <Route exact path="/" component={MainPage} />
          <Route exact path = '/users' component = {UsersPage} />
          <Route exact path = '/gold_coins' component = {Gold_coins} />
          <Redirect to = '/404' />
        </Switch>
      </Router>
    );
  }
}

export default App;