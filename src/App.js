import React, { Component } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Component/Home'
import Dashboard from './Component/Dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/quiz/:ID">
            <Quiz />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
    </Router>
    );
  }
}

export default App;




function Quiz() {
  return (
    <div>
      <h2>Quiz</h2>
    </div>
  );
}

