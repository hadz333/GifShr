// this is the profile page component
import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import '../styles/accountCreation.css';
import '../styles/switch.css';
import ProfileHeader from './ProfileHeader';
import PostGrid from './PostGrid';
import { Row, Col } from 'react-bootstrap';

class ProfilePage extends Component {
  constructor(props) {
    super(props)
    if (localStorage.getItem('gridLayout') === 'true') {
      this.state = {
        gridLayout: true,
        posts: [],
      }
    } else {
      this.state = {
        gridLayout: false,
        posts: [],
      }
    }
  }

  // this will enable Link usage as opposed to <a href>
  // (not reloading whole page) when going to another profile
  // while already on the /profile/:user path.
  componentDidUpdate(prevProps, prevState, snapshot) {
    // check path name (/profile/:user) and check if changed
    if (this.props.location.pathname !== prevProps.location.pathname ||
        this.props.likedPostsByUser !== prevProps.likedPostsByUser) {
      this.renderPosts()
    }
  }

  componentDidMount() {
    this.renderPosts()
  }

  // render posts
  renderPosts = async () => {
    // parse URL and grab username of profile being viewed
    const current_url = window.location.href
    await this.setState({
      posts: []
    })
    // rendered on a profile page
    if (current_url.includes('profile/')) {
      let profileViewed = current_url.split('profile/')[1]
      // check if post appended in url
      if (profileViewed.includes('/')) {
        profileViewed = profileViewed.split('/')[0]
      }

      const response = await fetch('/posts/renderPosts/' + profileViewed, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .catch((error) => {
        console.log(error)
      })

      const body = await response.text()

      const parsedBody = await JSON.parse(body)
      // console.log(parsedBody)
      // get all image sources for this profile's posts
      let posts = []
      for (let i = 0; i < parsedBody.length; i++) {
        await posts.push(parsedBody[i])
      }
      await this.setState({
        posts: posts
      })
    } else {
      this.setState({
        posts: this.props.likedPostsByUser
      })
    }
  }

  handleSwitchToggle(e) {
    // if switch is on or not
    const checked = e.target.checked

    if (checked) {
      this.setState({
        gridLayout: true
      })
      localStorage.setItem('gridLayout', "true")
    } else {
      this.setState({
        gridLayout: false
      })
      localStorage.setItem('gridLayout', "false")
    }
  }

  render() {
    const current_url = window.location.href
    // rendered on a profile page
    if (current_url.includes('profile/')) {
      return (
        <div>
        <ProfileHeader
          user={localStorage.getItem('plumUser56010')}
          loggedInUserFollowing={this.props.loggedInUserFollowing}
          url={current_url}
        />
        <hr />
        <Row>
        <Col style={{textAlign: "right", marginTop: '4px'}}>
          Post Grid
        </Col>
        <Col>
          <label className="switch">
            <input
              name="layoutSwitch"
              type="checkbox"
              checked={this.state.gridLayout}
              onChange={(event) => this.handleSwitchToggle(event)}
            />
            <span className="slider round"></span>
          </label>
        </Col>
        </Row>

        <PostGrid
          gridLayout={this.state.gridLayout}
          posts={this.state.posts}
          likedPostsByUser={this.props.likedPostsByUser}
          url={current_url}
        />
        </div>
      )
    } else {
      return (
        <div>
        <Row>
        <Col style={{textAlign: "right", marginTop: '4px'}}>
          Post Grid
        </Col>
        <Col>
          <label className="switch">
            <input
              name="layoutSwitch"
              type="checkbox"
              checked={this.state.gridLayout}
              onChange={(event) => this.handleSwitchToggle(event)}
            />
            <span className="slider round"></span>
          </label>
        </Col>
        </Row>

        <PostGrid
          gridLayout={this.state.gridLayout}
          posts={this.state.posts}
          likedPostsByUser={this.props.likedPostsByUser}
          url={current_url}
        />
        </div>
      )
    }
  }
}
export default ProfilePage;
