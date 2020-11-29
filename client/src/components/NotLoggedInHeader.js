import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotLoggedInHeader extends Component {

  render() {
    return (
      <div id="notLoggedInHeader">
        <Link to="/timeline">
        <img
          id="appLogo"
          src={
            process.env.PUBLIC_URL + '/GifShrText15.png'
          }
          style={{marginTop: '20px', float: 'left'}}
          alt="GifShr"
        />
        </Link>
        <span id="notLoggedInHeaderButtons">
          <Link to="/login">
            <button
              type="button"
              className="btn btn-outline-dark"
              id="headerLoginButton"
              width="400px"
            >
              Log in
            </button>
          </Link>
          <Link to="/accountCreation">
            <button
              type="button"
              className="btn btn-outline-dark"
              id="signUpButton"
              width="400px"
            >
              Sign up
            </button>
          </Link>
        </span>
        <div style={{clear: 'both'}}></div>
        <br />
      </div>
    )
  }
}

export default NotLoggedInHeader;
