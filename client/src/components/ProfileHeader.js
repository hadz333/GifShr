import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import '../styles/accountCreation.css';
import '../styles/Header.css';
import ProfileActions from './ProfileActions';

// numbers which dictate a change in format
const ONE_MILLION = 1000000
const ONE_HUNDRED_THOUSAND = 100000
const TEN_THOUSAND = 10000
const ONE_THOUSAND = 1000

class ProfileHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      response: '',
      profileName: '',
      postCount: 0,
      followingCount: 0,
      followerCount: 0,
      description: '',
      profilePicNsfw: false
    }
  }

  componentDidMount() {
    this.retrieveProfileInfo()
      .catch(err => console.log(err))
  }

  // this will enable Link usage as opposed to <a href>
  // (not reloading whole page) when going to another profile
  // while already on the /profile/:user path.
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.url !== prevProps.url) {
      this.retrieveProfileInfo()
        .catch(err => console.log(err))
    }
  }

  // retrieve info of the profile being viewed
  retrieveProfileInfo = async () => {
    // parse URL and grab username of profile being viewed
    const current_url = window.location.href
    let profileViewed = await current_url.split('profile/')[1]
    // check if post appended in url
    if (profileViewed.includes('/')) {
      profileViewed = await profileViewed.split('/')[0]
    }
    profileViewed = profileViewed.toLowerCase()
    // retrieve info of profile being viewed
    const response = await fetch('/profile/retrieveProfileInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: profileViewed,
        token: localStorage.getItem('token'),
        profileHeader: 'please send counts only'
      })
    })
    const body = await response.text()
    const profileNotFound = "profile not found."
    if (body === profileNotFound) {
      this.setState({ response: profileNotFound })
    } else if (body.includes("<") || body === 'error') {
      this.setState({
        response: "Please reload page to see profile info."
      })
    } else {
      const parsedBody = await JSON.parse(body)
      await this.setState({
        profileName: parsedBody.username,
        postCount: parsedBody.postCount,
        followerCount: parsedBody.followerCount,
        followingCount: parsedBody.followingCount,
        profileImage: parsedBody.profileImage,
        description: parsedBody.description,
        profilePicNsfw: parsedBody.profilePicNsfw
      })

      if (parsedBody.profilePicNsfw) {
        if (localStorage.getItem('showNsfw') === 'false') {
          await this.setState({
            profileImage: '/nsfw_post_in_grid_with_auto_nsfw_off.png'
          })
        }
      }
      this.setNumberConversions()
    }
  }

  // set the numbers to strings
  // (including commas or decimals, or ending with K or M)
  setNumberConversions = () => {
    const followerCount = this.state.followerCount
    const followingCount = this.state.followingCount
    const postCount = this.state.postCount

    // follower count
    if (followerCount >= ONE_MILLION) {
      this.setState({
        followerCount: (followerCount / ONE_MILLION).toFixed(1) + 'M'
      })
    } else if (followerCount >= ONE_HUNDRED_THOUSAND) {
      this.setState({
        followerCount: Math.round(followerCount / ONE_THOUSAND) + 'K'
      })
    } else if (followerCount >= TEN_THOUSAND) {
      this.setState({
        followerCount: (followerCount / ONE_THOUSAND).toFixed(1) + 'K'
      })
    } else if (followerCount >= ONE_THOUSAND) {
      let followerString = followerCount.toString()
      this.setState({
        followerCount: followerString[0] + ',' + followerString.substring(1, 4)
      })
    }

    // following count
    if (followingCount >= ONE_MILLION) {
      this.setState({
        followingCount: (followingCount / ONE_MILLION).toFixed(1) + 'M'
      })
    } else if (followingCount >= ONE_HUNDRED_THOUSAND) {
      this.setState({
        followingCount: Math.round(followingCount / ONE_THOUSAND) + 'K'
      })
    } else if (followingCount >= TEN_THOUSAND) {
      this.setState({
        followingCount: (followingCount / ONE_THOUSAND).toFixed(1) + 'K'
      })
    } else if (followingCount >= ONE_THOUSAND) {
      let followingString = followingCount.toString()
      this.setState({
        followingCount: followingString[0] + ',' + followingString.substring(1, 4)
      })
    }

    // post count
    if (postCount >= TEN_THOUSAND) {
      this.setState({
        postCount: (postCount / ONE_THOUSAND).toFixed(1) + 'K'
      })
    } else if (postCount >= ONE_THOUSAND) {
      let postCountString = postCount.toString()
      this.setState({
        postCount: postCountString[0] + ',' + postCountString.substring(1, 4)
      })
    }
  }

  render() {
    if (this.state.response) {
      return (
        <div className="App">
          <h4>{this.state.response}</h4>
        </div>
      )
    }

    return (
      <div className="App" id="profileHeader">
        <span id="profilePicInProfileHeader">
          <img
            id="profilePicture"
            src={process.env.PUBLIC_URL + this.state.profileImage}
            alt="profile"
          />
        </span>
        <span id="profileStats">
        <br />
        <h5 id="profileHeaderProfileName">{this.state.profileName}</h5>

          {this.state.followerCount} Followers &nbsp;&nbsp;
          {this.state.followingCount} Following &nbsp;&nbsp;
          {this.state.postCount} posts
        </span>
        <div style={{clear: 'both'}}></div>
        <br />
        <p id="profileHeaderDescription">
          {this.state.description}
        </p>
        <ProfileActions
          profile={this.state.profileName}
          followingList={this.props.loggedInUserFollowing}
          url={this.props.url}
        />
      </div>
    );
  }
}

export default ProfileHeader;
