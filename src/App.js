import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import GameController from './containers/GameController/GameController';
import Profile from './containers/Profile/Profile';

class App extends Component {
  state = {
    loggedIn: false,
    JWT: null,
    userId: null,
    userData: null
  }

  componentDidMount() {
    axios({
      method: 'POST',
      url: 'http://localhost:8000/users/login',
      data: {
        email: 'test@test.com',
        password: 'test'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            loggedIn: true,
            JWT: res.data.token,
            userId: res.data.userId
          })
          this.getPlayerData(res.data.token);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  getPlayerData = (token) => {
    axios({
      method: 'GET',
      url: 'http://localhost:8000/users/' + this.state.userId + '/history',
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          this.setState({
            userData: res.data.playerData
          })
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error getting data please try again');
      });
  }


  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Switch>

            <Route
              path="/profile"
              render={(props) => <Profile {...props}
                loggedIn={this.state.loggedIn}
                JWT={this.state.JWT}
                userId={this.state.userId}
                userData={this.state.userData}
                updateData={this.getPlayerData} />}
            />
            <Route path="/game"
              render={(props) => <GameController {...props}
                loggedIn={this.state.loggedIn}
                JWT={this.state.JWT}
                userId={this.state.userId} />}
            />
            <Redirect from="/" to="/profile" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
