import React, { Component } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

class LoggedInHeader extends Component {
  constructor(props) {
    super(props)
    if (localStorage.getItem('profileImage')) {
      this.state = {
        profileImage: localStorage.getItem('profileImage')
      }
    } else {
      this.state = {
        profileImage: process.env.PUBLIC_URL
        + '/default_profile_image.png'
      }
    }
    this.banCheck()
  }

  logOut = () => {
    localStorage.setItem('plumUser56010', "")
    localStorage.setItem('darkMode', "")
    localStorage.setItem('showNsfw', "")
    localStorage.setItem('autoShowNsfw', "")
    localStorage.setItem('autoCheckNsfwOnPosts', "")
    localStorage.setItem('token', "")
    window.location.reload(false);
  }

  // show or hide the navbar menu links
  toggleMenu = () => {
    const menu = document.getElementById("menuLinks")
    const menuHamburger = document.getElementById("menuHamburger")
    if (menu.style.display === 'block') {
      menu.style.display = 'none'
      menuHamburger.style.color = 'black'
    } else {
      menu.style.display = 'block'
      menuHamburger.style.color = 'grey'
    }
  }

  // check if signed in user is banned (force log-out if so)
  banCheck = async () => {
    const username = localStorage.getItem('plumUser56010')
    const response = await fetch('/report/checkBanStatus/' + username)
    const body = await response.text()
    if (body === "exists") {
      this.logOut()
    }
  }

  render() {

    return (
      <div>
        <Link to="/" id="loggedInHeaderAppLogo">
        <img
          src={
            process.env.PUBLIC_URL + '/GifShrText15.png'
          }
          style={{marginTop: '20px'}}
          alt="GifShr"
        />
        </Link>

        <span id="loggedInHeaderButtons">
          <Link to={"/profile/" + localStorage.getItem('plumUser56010')}>
            <img
              id="headerProfileLink"
              src={
                this.state.profileImage
              }
              alt="logo"
            />
          </Link>
            < FontAwesomeIcon
              icon="bars"
              id="menuHamburger"
              className="icon"
              onClick={this.toggleMenu}
            />
        </span>
        <div style={{clear: 'both'}}></div>
        <br />
        <div id="menuLinks" style={{marginBottom: '20px'}}>
          <Link
            to={"/profile/" + localStorage.getItem('plumUser56010')}
            onClick={this.toggleMenu}
            className="abababa"
            style={localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5'} : {color: 'black'}}
          >
            < FontAwesomeIcon icon="user" id="profileIcon" />
            &nbsp;
            My Profile
          </Link>
          <Link
            to={"/createPost"}
            onClick={this.toggleMenu}
            style={localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5'} : {color: 'black'}}
          >
            < FontAwesomeIcon icon="plus" />
            &nbsp;
            Create New Post
          </Link>
          {
          // <Link to={"/CreateArticlePost"} onClick={this.toggleMenu}>
          //   < FontAwesomeIcon icon="file-alt" />
          //   &nbsp;
          //   Create New Article
          // </Link>
          }
          <Link
            to={"/likedPosts"}
            onClick={this.toggleMenu}
            style={localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5'} : {color: 'black'}}
          >
            < FontAwesomeIcon icon="thumbs-up" />
            &nbsp;
            Liked Posts
          </Link>
          <Link
            to="/settings"
            onClick={this.toggleMenu}
            style={localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5'} : {color: 'black'}}
          >
            < FontAwesomeIcon icon="cog" id="settingsIcon" />
            &nbsp;
            Settings
          </Link>
          <a
            href="/login"
            onClick={this.logOut}
            style={localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5'} : {color: 'black'}}
          >
            < FontAwesomeIcon icon="sign-out-alt" id="signOutIcon" />
            &nbsp;
            Sign out
          </a>
        </div>
      </div>
    )
  }
}

export default LoggedInHeader;
