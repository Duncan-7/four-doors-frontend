import React, { Component } from 'react';

class Profile extends Component {
  state = {
    loggedIn: "no",
    pastRestuls: null
  }

  componentDidMount() {
    fetch('https://polar-basin-72888.herokuapp.com/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        console.log(res.body);
      })
  }

  authTest() {
    fetch('https://polar-basin-72888.herokuapp.com/users/test')
      .then(res => {
        console.log(res);
      })
  }

  render() {
    return (
      <div>
        <p>Logged In: {this.state.loggedIn}</p>
        <p>Some past results stuff</p>
        <button onClick={this.authTest}>test</button>
      </div>
    );
  }
}

export default Profile;