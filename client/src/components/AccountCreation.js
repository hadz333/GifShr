import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import '../styles/accountCreation.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

// account creation timeout (5 mins)
const ACCOUNT_CREATION_TIMEOUT = 300000

class AccountCreation extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    username: '',
    password: '',
    repeatPassword: '',
    email: '',
    redirect: false
  }

  handleSubmit = async e => {
    e.preventDefault()
    // if another account was created less than 5 minutes ago, deny

    if (localStorage.getItem('lastAccountCreation')) {
      const lastSubmitDate = await Date.parse(
        localStorage.getItem('lastAccountCreation')
      )
      if (Date.now() - lastSubmitDate < ACCOUNT_CREATION_TIMEOUT) {
        this.setState({
          responseToPost: 'You cannot create another account so quickly. Please wait a couple of minutes.'
        })
        return
      } else {
        this.setState({
          responseToPost: ''
        })
      }
    }


    let userValid = true
    let passwordValid = true
    let emailValid = true
    const usernameErrorText = document.getElementById("usernameErrorText")
    const emailErrorText = document.getElementById('emailErrorText')

    // get input boxes
    const usernameInput = document.getElementById('usernameInput')
    const passwordInput = document.getElementById('passwordInput')
    const repeatPasswordInput = document.getElementById('repeatPasswordInput')
    const emailInput = document.getElementById('emailInput')
    usernameInput.style.borderColor = 'gainsboro'
    passwordInput.style.borderColor = 'gainsboro'
    repeatPasswordInput.style.borderColor = 'gainsboro'
    emailInput.style.borderColor = 'gainsboro'

    var re = /^\w+$/;
    if (!re.test(this.state.username)) {
      usernameErrorText.style.display = 'inline'
      userValid = false
      usernameInput.style.borderColor = 'red'
    } else {
      usernameErrorText.style.display = 'none'
      userValid = true
    }

    if (this.state.email.length < 1) {
      emailInput.style.borderColor = 'red'
      emailValid = false
      emailErrorText.style.display = 'inline'
    } else {
      emailErrorText.style.display = 'none'
      emailValid = true
    }

    if (this.state.password !== this.state.repeatPassword) {
      this.setState({ responseToPost: "Passwords do not match" })
      passwordInput.style.borderColor = 'red'
      repeatPasswordInput.style.borderColor = 'red'
    } else if (this.state.password.length > 0 &&
               this.state.username.length > 0 &&
               userValid && passwordValid && emailValid) {
      const response = await fetch('/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        })
      })
      const body = await response.text()
      if (body.includes("success")) {
        // set last account created
        localStorage.setItem('lastAccountCreation', new Date().toString())
        // redirect to your profile page
        const returnedId = body.split(', ')[1]
        localStorage.setItem('token', returnedId)
        this.setState({ redirect: true })
      } else if (body === "Username already exists") {
        const usernameInput = document.getElementById('usernameInput')
        usernameInput.style.borderColor = 'red'
      } else if (body === "An account with this email already exists") {
        emailInput.style.borderColor = 'red'
      }
      this.setState({ responseToPost: body })
    } else {
      if (userValid && passwordValid && emailValid) {
        this.setState({
          responseToPost: "Password cannot be empty"
        })
        passwordInput.style.borderColor = 'red'
        repeatPasswordInput.style.borderColor = 'red'
      } else {
        this.setState({
          responseToPost: ""
        })
      }
    }
  }

  render() {
    // if already logged in, redirect to your profile
    if (localStorage.getItem('plumUser56010')) {
      return <Redirect to="/timeline" />
    }

    // if account creation was successful, redirect to your profile
    if (this.state.redirect) {
      // set user to username and save to browser storage
      localStorage.setItem('plumUser56010', this.state.username.toLowerCase())
      window.location.reload(false)
      return <Redirect to="/timeline" />
    }
    return (
      <div className="App">
        <header className="App-header">

        </header>
        <p>{this.state.response}</p>
        <h2>
          <strong>Create a GifShr account </strong>
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              value={this.state.username}
              placeholder="Username"
              maxLength="30"
              onChange={e => this.setState({ username: e.target.value })}
            />
          </div>
          <div id="usernameErrorText">
            Usernames can only contain letters (a-z), numbers (0-9),
            underscores (_).
            <br />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="Password"
              minLength="5"
              maxLength="30"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="repeatPasswordInput"
              placeholder="Repeat password"
              minLength="5"
              maxLength="30"
              onChange={e => this.setState({ repeatPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            NOTE: This email is only used for password recovery. We will not send you anything otherwise.<br />
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="Email"
              minLength="2"
              maxLength="60"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div id="emailErrorText" style={{display: 'none', color: 'red'}}>
            Please enter a valid email.
            <br />
          </div>
          <p id="responseText">{this.state.responseToPost}</p>
          <button type="submit" className="btn btn-success">
            Create new account
          </button>
        </form>
        <Link to="/login">
          <button type="button" className="btn btn-outline-secondary">
            Back to login
          </button>
        </Link>
        <br />
        <br />
        {
          // <UpcomingFeaturePlug />
        }
      </div>
    );
  }

}

export default AccountCreation;
