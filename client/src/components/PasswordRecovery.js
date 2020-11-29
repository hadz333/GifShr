import React, { Component } from 'react';

class PasswordRecovery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      responseToRequest: '',
      emailSentTo: ''
    }
  }

  // send recovery code to this email
  sendRecoveryCode = async () => {
    // if email is entered, request from api
    const emailInput = document.getElementById('emailInput').value

    if (emailInput === '') {
      // display empty message
      document.getElementById('emailEmptyError').style.display = 'inline'
      return
    } else {
      document.getElementById('emailEmptyError').style.display = 'none'
    }

    const response = await fetch('/profile/requestRecoveryCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput
      })
    })

    const body = await response.text()

    if (body === 'does not exist') {
      // if response is 'does not exist',
      // relay message that username or email does not exist
      document.getElementById('emailDoesNotExistError').style.display = 'inline'
    } else if (body === 'sent'){
      document.getElementById('emailDoesNotExistError').style.display = 'none'
      document.getElementById('emailEmptyError').style.display = 'none'
      document.getElementById('recoverySentRecently').style.display = 'none'
      // if response is 'sent',
      // relay message that recovery code has been sent
      this.setState({
        emailSentTo: emailInput
      })

      // display the recovery code entry box
      // hide the input boxes
      document.getElementById('passwordRecoveryForm').style.display = 'none'
      document.getElementById('recoveryCodeForm').style.display = 'inline'
    } else if (body === 'please wait') {
      document.getElementById('recoverySentRecently').style.display = 'inline'
    }
  }

  // send request to set new password
  setNewPassword = async () => {
    // if email is entered, request from api
    const recoveryCodeInput = document.getElementById('recoveryCodeInput').value
    const newPasswordInput = document.getElementById('newPasswordInput').value
    const repeatNewPasswordInput = document.getElementById('repeatNewPasswordInput').value

    if (!recoveryCodeInput) {
      // display empty message
      document.getElementById('recoveryCodeError').style.display = 'inline'
      return
    } else {
      document.getElementById('recoveryCodeError').style.display = 'none'
    }

    // verify new password is between 5 and 30 chars, and passwords match
    if (newPasswordInput.length < 5) {
      document.getElementById('newPasswordLengthError').style.display = 'inline'
      return
    } else {
      document.getElementById('newPasswordLengthError').style.display = 'none'
    }

    if (newPasswordInput !== repeatNewPasswordInput) {
      document.getElementById('newPasswordsDoNotMatchError').style.display = 'inline'
      return
    } else {
      document.getElementById('newPasswordsDoNotMatchError').style.display = 'none'
    }

    const response = await fetch('/profile/requestPasswordReset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recoveryCode: recoveryCodeInput,
        email: this.state.emailSentTo,
        newPassword: newPasswordInput
      })
    })

    const body = await response.text()

    if (body === 'incorrect recovery code') {
      // if response is 'incorrect recovery code',
      // relay message that incorrect recovery code was entered
      document.getElementById('incorrectRecoveryCodeError').style.display = 'inline'
    } else if (body !== 'error'){
      document.getElementById('recoveryCodeForm').style.display = 'none'
      document.getElementById('resetSuccessful').style.display = 'inline'
    }
  }

  render() {
    return (
      <div style={{width: '80%', textAlign: 'center', margin: 'auto', paddingTop: '40px'}}>
        <h3>Password Recovery</h3>
        <div id="passwordRecoveryForm">
          Enter email associated with your account:
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="Email"
            />
          </div>
          <div
            id="emailEmptyError"
            style={{color: 'red', display: 'none'}}>

            Email cannot be empty.
            <br />
          </div>
          <div
            id="recoverySentRecently"
            style={{color: 'red', display: 'none'}}>

            There was recently a recovery request for this account. 
            You must wait 5 minutes before requesting another recovery code.
            <br />
          </div>
          <div
            id="emailDoesNotExistError"
            style={{color: 'red', display: 'none'}}>

            There is no account associated with this email.
            <br />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '200px'}}
            onClick={this.sendRecoveryCode}
          >
            Send Code
          </button>
        </div>
        <div id="recoveryCodeForm" style={{display: 'none'}}>
          <br />
          Enter 8-digit code sent to your email.
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              id="recoveryCodeInput"
              placeholder="8-digit code"
            />
          </div>
          <div id="recoveryCodeError" style={{color: 'red', display: 'none'}}>
          <br />
            You must enter the recovery code sent to your email. <br />Not getting an email?
            Check your spam folder or try again.
          <br />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              minLength="5"
              maxLength="30"
              id="newPasswordInput"
              placeholder="New password"
            />
          </div>
          <div id="newPasswordLengthError" style={{color: 'red', display: 'none'}}>
            Your password must be between 5 and 30 characters.
            <br />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              minLength="5"
              maxLength="30"
              id="repeatNewPasswordInput"
              placeholder="Repeat new password"
            />
          </div>
          <div id="newPasswordsDoNotMatchError" style={{color: 'red', display: 'none'}}>
            Your new password entries do not match.
            <br />
          </div>
          <div id="incorrectRecoveryCodeError" style={{color: 'red', display: 'none'}}>
            Incorrect recovery code entered. You must get a new recovery code.
            <br />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            style={{width: '200px'}}
            onClick={this.setNewPassword}
          >
            Set new password
          </button>
        </div>
        <div
          id="resetSuccessful"
          style={{display: 'none'}}>
          <br />
          Your password has been successfully reset. <a href="/login">Log in.</a>
          <br />
        </div>
      </div>
    )
  }
}

export default PasswordRecovery;
