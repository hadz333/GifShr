import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class LoginPage extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    username: '',
    password: '',
    redirect: false
  }

  handleSubmit = async e => {
    e.preventDefault()
    const response = await fetch('/profile/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username.toLowerCase(),
        password: this.state.password
      })
    })
    const body = await response.text()
    if (body.includes("success")) {
      // redirect to your profile page
      let profileImage = body.split(": ")[1]
      profileImage = profileImage.split(", token - ")[0]
      localStorage.setItem('profileImage', profileImage)
      const token = body.split(" - ")[1].split(" username? ")[0]
      localStorage.setItem('token', token)
      const newUsername = await body.split(" username? ")[1]
      await this.setState({
        username: newUsername
      })
      // retrieve user's preferences from databases
      const preferencesResponse = await fetch(
        '/profile/getPreferences/' + this.state.username
      )
      const preferencesBody = await preferencesResponse.text()
      const parsedPreferencesBody = await JSON.parse(preferencesBody)
      // set the preferences in local storage
      localStorage.setItem('darkMode', parsedPreferencesBody.darkMode)
      localStorage.setItem('showNsfw', parsedPreferencesBody.showNsfw)
      localStorage.setItem('autoShowNsfw', parsedPreferencesBody.autoShowNsfw)
      localStorage.setItem(
        'autoCheckNsfwOnPosts', parsedPreferencesBody.autoCheckNsfwOnPosts
      )
      this.setState({ redirect: true })
    } else if (body === 'invalid password') {
      this.setState({ responseToPost: 'Invalid username and/or password' })
    } else if (body === 'Username does not exist') {
      this.setState({ responseToPost: 'Username does not exist'})
    } else {
      this.setState({ responseToPost: body})
    }
  }

  render() {
    // if already logged in, redirect to your timeline
    if (localStorage.getItem('plumUser56010')) {
      return <Redirect to={"/timeline"} />
    }

    // if log-in was successful, redirect to your profile
    if (this.state.redirect) {
      localStorage.setItem('plumUser56010', this.state.username)
      window.location.reload(false);
      return <Redirect to={"/profile/" + this.state.username.toLowerCase()} />
    }

    return (
      <div className="App">
        <header className="App-header">

        </header>
        <p>{this.state.response}</p>
        <h2>
          <strong>Welcome to GifShr</strong>
        </h2>
        Don't have an account? <Link to="/accountCreation">Sign up!</Link><br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              value={this.state.username}
              placeholder="Username or e-mail"
              onChange={e => this.setState({ username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <p>{this.state.responseToPost}</p>
          <button type="submit" className="btn btn-primary">Login</button>
          <br />
          <br />
          Forgot your password? <Link to="/passwordRecovery">Click here</Link>
        </form>
        <br />
        <br />
        {
          // <UpcomingFeaturePlug />
        }
      </div>
    );
  }
}

export default LoginPage;
