import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Door from '../../components/Door/Door';
import Button from '../../components/Button/Button';
import axios from 'axios';

class GameController extends Component {
  state = {
    round: 1,
    winnings: 0,
    started: false,
    inRound: false,
    gameOver: false,
    lost: false,
    door1Text: "",
    door2Text: "",
    door3Text: "",
    door4Text: "",
    gameId: null
  }

  startGame = () => {
    this.clearDisplay();
    this.setState({
      round: 1,
      winnings: 0,
      started: true,
      inRound: true,
      lost: false,
      gameOver: false
    });
    this.createDatabaseEntry();
  }

  nextRound = () => {
    this.clearDisplay();
    const newRound = this.state.round + 1
    this.setState({
      round: newRound,
      inRound: true,
    })
  }

  cashout = () => {
    this.setState({
      gameOver: true
    })
    this.updateDatabase(this.state.winnings, this.state.round, true);
  }

  chooseDoor = (index) => {
    if (!this.state.inRound) {
      return;
    }
    const result = this.generateResult();
    const prize = this.calculatePrize(result);
    this.displayResults(index, prize);
    if (result === 0) {
      this.setState({
        winnings: 0,
        inRound: false,
        gameOver: true,
        lost: true
      })
      this.updateDatabase(0, this.state.round, true);
    }
    if (result !== 0) {
      this.updateDatabase(this.state.winnings + prize, this.state.round, false);
      this.setState({
        winnings: this.state.winnings + prize,
        inRound: false
      })
    }
  }

  generateResult() {
    return Math.floor(Math.random() * 4);
  }

  calculatePrize(result) {
    return 10 * result * this.state.round;
  }

  displayResults = (index, prize) => {
    let newState = {
      ...this.state
    }
    if (prize === 0) {
      newState[`door${index}Text`] = "You Lose"
    } else {
      newState[`door${index}Text`] = prize;
    }
    this.setState(newState);
  }

  clearDisplay = () => {
    this.setState({
      door1Text: "",
      door2Text: "",
      door3Text: "",
      door4Text: ""
    })
  }

  createDatabaseEntry = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:8000/playthroughs',
      data: {
        user: this.props.userId,
        winnings: 0,
        round: 1,
        complete: false
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.props.JWT
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            gameId: res.data.gameId
          })
          console.log("game created")
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error creating game please try again');
      });
  }

  updateDatabase = (winnings, round, complete) => {
    axios({
      method: 'POST',
      url: 'http://localhost:8000/playthroughs/' + this.state.gameId,
      data: {
        user: this.props.userId,
        winnings: winnings,
        round: round,
        complete: complete
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.props.JWT
      }
    })
      .then(res => {
        if (res.status === 200) {
          console.log("game saved")
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error updating game please try again');
      });
  }

  render() {
    let text = "Explanation of how the game works"

    let controls = <Button clicked={this.startGame} btnType="btn-primary">Start</Button>
    if (this.state.inRound) {
      text = "Pick a door"
      controls = null;
    }
    if (!this.state.inRound && this.state.started) {
      text = "Cash out now, or play another round";
      controls = [
        <Button key={1} clicked={this.nextRound} btnType="btn-primary">Next Round</Button>,
        <Button key={2} clicked={this.cashout} btnType="btn-primary">Cash Out</Button>
      ]
    }
    if (this.state.gameOver) {
      text = `Know when to hold 'em, know when to fold 'em...You won ${this.state.winnings} coins! Click below to play again!`
      controls = [
        <Button key={1} clicked={this.startGame} btnType="btn-primary">Play Again</Button>,
        <NavLink key={2} to="/profile">
          <Button btnType="btn-primary" onClick={this.props.updateData}>Back To Profile</Button>
        </NavLink>
      ]
    }

    if (this.state.gameOver && this.state.lost) {
      text = 'You lost! Good job, Icarus. Click below to try again'
    }

    let doors = [
      <Door key={1} index={1} onSelect={this.chooseDoor} content={this.state.door1Text} />,
      <Door key={2} index={2} onSelect={this.chooseDoor} content={this.state.door2Text} />,
      <Door key={3} index={3} onSelect={this.chooseDoor} content={this.state.door3Text} />,
      <Door key={4} index={4} onSelect={this.chooseDoor} content={this.state.door4Text} />
    ]

    return (
      <div className="game">
        <h1>Game Title</h1>
        {text}
        <p>Round: {this.state.round}</p>
        <p>Winnings: {this.state.lost ? `${this.state.winnings} coins down the drain` : this.state.winnings}</p>
        <div className="door-container">
          {doors}
        </div>
        {controls}
      </div>
    );
  }
}

export default GameController;