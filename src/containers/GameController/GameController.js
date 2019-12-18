import React, { Component } from 'react';
import Door from '../../components/Door/Door';
import Button from '../../components/Button/Button';

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
    })
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
    }
    if (!this.state.gameOver) {
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
        <Button key={2} btnType="btn-primary">Back To Profile</Button>
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