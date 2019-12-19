import React from 'react';
import './App.css';
import { BrowserRouter, Route, NavLink, Redirect, Switch } from 'react-router-dom';
import GameController from './containers/GameController/GameController';
import Profile from './containers/Profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route path="/profile" component={Profile} />
          <Route path="/game" component={GameController} />
          <Redirect from="/" to="/profile" />
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
