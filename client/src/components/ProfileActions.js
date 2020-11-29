import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import '../styles/accountCreation.css';
import '../styles/Header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ProfileActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      followingThisProfile: false,
      loggedInUserFollowing: this.props.followingList
    }
  }

  componentDidMount() {
    this.retrieveUserInfo()
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url) {
      this.checkIfFollowedByUser()
    }
  }

  // retrieve info of the user signed in
  retrieveUserInfo = async () => {
    // make sure user is signed in
    if (!localStorage.getItem('plumUser56010')) {
      return
    }
    const user = localStorage.getItem('plumUser56010')
    if (user) {
      const response = await fetch('/profile/retrieveProfileInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: user,
          token: localStorage.getItem('token')
        })
      })
      const body = await response.text()
      if (body !== "profile not found." && body !== 'error') {
        const parsedBody = JSON.parse(body)
        await this.setState({
          loggedInUserFollowing: parsedBody.following
        })
        this.checkIfFollowedByUser()
      }
    }
  }

  // check if followed by user
  checkIfFollowedByUser = () => {
    const current_url = window.location.href
    const usefulInfo = current_url.split('profile/')[1]
    const user = usefulInfo.split('/')[0].split('#')[0]
    if (this.state.loggedInUserFollowing.includes(user)) {
      if (!this.state.followingThisProfile) {
        this.setState({
          followingThisProfile: true
        })
      }
    } else {
      if (this.state.followingThisProfile) {
        this.setState({
          followingThisProfile: false
        })
      }
    }
  }

  // user wants to follow this profile
  profileFollow = async () => {
    // make sure user is signed in
    if (!localStorage.getItem('plumUser56010')) {
      const mustBeSignedIn = document.getElementById("mustBeSignedIn")
      mustBeSignedIn.style.display = 'inline'
      return
    }
    this.setState({
      followingThisProfile: true
    })
    const response = await fetch('/profile/userFollowAction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userFollowing: localStorage.getItem('plumUser56010'),
        userFollowed: this.props.profile,
        isFollowing: true,
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body !== 'successful follow/unfollow action') {
      alert("Follow action unsuccessful. Please refresh and try again.")
    }
  }

  // user wants to unfollow this profile
  profileUnfollow = async () => {
    // make sure user is signed in
    if (!localStorage.getItem('plumUser56010')) {
      const mustBeSignedIn = document.getElementById("mustBeSignedIn")
      mustBeSignedIn.style.display = 'inline'
      return
    }
    this.setState({
      followingThisProfile: false
    })
    const response = await fetch('/profile/userFollowAction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userFollowing: localStorage.getItem('plumUser56010'),
        userFollowed: this.props.profile,
        isFollowing: false,
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body !== 'successful follow/unfollow action') {
      alert("Unfollow action unsuccessful. Please refresh and try again.")
    }
  }

  // show report confirmation on a profile
  showProfileReportForm = () => {
    const reportProfileConfirmation = document.getElementById('reportProfileConfirmation')
    if (reportProfileConfirmation.style.display === 'none') {
      reportProfileConfirmation.style.display = 'inline'
    } else {
      reportProfileConfirmation.style.display = 'none'
    }
  }

  // profile report submission
  submitProfileReport = async () => {
    if (!localStorage.getItem('plumUser56010')) {
      alert("You must be signed in to perform this action.")
      return
    }
    const response = await fetch('/report/submitReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        defendant: this.props.profile,
        reportDate: new Date(),
        reportedBy: localStorage.getItem('plumUser56010')
      })
    })
    const body = await response.text()
    if (body === 'success') {
      // hide report button
      const reportProfileConfirmation = document.getElementById('reportProfileConfirmation')
      reportProfileConfirmation.innerHTML = '<br />Thank You for submitting your report. A human will review this profile.'

    } else {
      alert("Report failed. Please try again later.")
    }
  }

  render() {
    if (this.props.profile === localStorage.getItem('plumUser56010')) {
      // if you are on your own profile, render edit profile button
      return (
        <div id="ownProfileOptions">
          <Link to="/editProfile" >
            <button type="button" className={localStorage.getItem('darkMode') === 'true' ? "btn btn-primary" : "btn btn-outline-primary"}>
              Edit Profile
              &nbsp;
              < FontAwesomeIcon icon="cog" />
            </button>
          </Link>
          <Link to="/createPost" >
            <button type="button" className={localStorage.getItem('darkMode') === 'true' ? "btn btn-success" : "btn btn-outline-success"}>
              New post
              &nbsp;
              < FontAwesomeIcon icon="plus"  />
            </button>
          </Link>
        </div>
      )
    } else if (this.state.followingThisProfile) {
      // if you are on a profile you are following,
      // render an "unfollow" button
      return (
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.profileUnfollow}
            style={{width: '200px', marginLeft: '10px'}}
          >
            Unfollow
          </button>
          <br />
          <button
            className="commentActionButton postActionButton postReportButton"
            id="profileReportButton"
            onClick={this.showProfileReportForm}
            style={{marginLeft: '20px', marginTop: '20px', verticalAlign: 'bottom', width: '120px'}}
          >
            < FontAwesomeIcon icon='flag' id="postReportIcon"/>
            Report Profile
          </button>
          <div
            id="reportProfileConfirmation"
            style={{display: 'none'}}>
            <br />
            Would you like us to review this profile?
            <button onClick={this.submitProfileReport}>Yes</button>
            <button onClick={this.showProfileReportForm}>No</button>
          </div>
        </div>
      )
    } else {
      // if you are on a profile you are not following,
      // render a "follow" button
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.profileFollow}
            style={{width: '200px', marginLeft: '10px'}}
          >
            Follow
          </button>
          <br />
          <button
            className="commentActionButton postActionButton postReportButton"
            id="profileReportButton"
            onClick={this.showProfileReportForm}
            style={{marginLeft: '20px', marginTop: '20px', width: '120px'}}
          >
            <FontAwesomeIcon icon='flag' id="postReportIcon" />
            Report Profile
          </button>
          <div
            id="reportProfileConfirmation"
            style={{display: 'none'}}>
            <br />
            Would you like us to review this profile?
            <button onClick={this.submitProfileReport}>Yes</button>
            <button onClick={this.showProfileReportForm}>No</button>
          </div>
          <div id="mustBeSignedIn" style={{display: 'none'}}>
            <br />
            You must be signed in to perform this action.
          </div>
        </div>
      )
    }
  }
}

export default ProfileActions;
