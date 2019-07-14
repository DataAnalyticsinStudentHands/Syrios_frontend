import React, { Component } from "react";
import "./App.css";
import MainPage from './components/Main'
import UsersPage from './components/users'
import NotFoundPage from './components/nf'
//Import all needed Component for this tutorial
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/404" component={NotFoundPage} />
          <Route exact path = '/users' component = {UsersPage} />
          <Redirect to = '/404' />
        </Switch>
      </Router>
    );
  }
}

export default App;