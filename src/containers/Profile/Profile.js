import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button/Button';

class Profile extends Component {

  authTest = () => {
    axios({
      method: 'GET',
      url: '/users/test',
      headers: {
        'Authorization': this.props.JWT
      }
    })
      .then(res => {
        if (res.status === 200) {
          alert("authorized");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error with authorization in please try again');
      });
  }

  render() {
    let numberOfGames = "loading..."
    let maxRound = 0
    let totalWinnings = "loading..."
    let accountBalance = "loading..."

    if (this.props.userData) {
      const completedGames = this.props.userData.playerData.filter(game => {
        return game.complete;
      });

      numberOfGames = completedGames.length

      completedGames.forEach(game => {
        if (game.round > maxRound) {
          maxRound = game.round;
        }
      });

      totalWinnings = completedGames.reduce((total, game) => {
        return total += game.winnings;
      }, 0)
      console.log(this.props.userData)
      accountBalance = this.props.userData.user.balance;
    }

    return (
      <div>
        <p>Logged In: {this.props.loggedIn.toString()}</p>
        <p>Games Played: {numberOfGames}</p>
        <p>Highest Round: {maxRound}</p>
        <p>Total Winnings: {totalWinnings}</p>
        <p>Current Account Balance: {accountBalance}</p>



        <NavLink to="/game">
          <Button btnType="btn-primary">Play Game</Button>
        </NavLink>
        <br />
        <br />
        <button onClick={this.authTest}>Test Authorization</button>
      </div>
    );
  }
}

export default Profile;