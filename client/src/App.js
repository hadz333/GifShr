import React, { Component } from 'react';
import './App.css';
import './fontawesome';
import './styles/loginPage.css';
import LoginPage from './components/LoginPage';
import AccountCreation from './components/AccountCreation';
import ProfilePage from './components/ProfilePage';
import EditProfile from './components/EditProfile';
import CreatePost from './components/CreatePost';
import { Switch, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import Search from './components/Search';
import IndividualPost from './components/IndividualPost';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Timeline from './components/Timeline';
import Settings from './components/Settings';
import About from './components/About';
import Faq from './components/Faq';
import Support from './components/Support';
import Guidelines from './components/Guidelines';
import PasswordRecovery from './components/PasswordRecovery';
import CreateArticlePost from './components/CreateArticlePost2';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      likedPostsByUser: [],
      likedCommentsByUser: [],
      loggedInUserFollowing: [],
      timelinePosts: [],
      globalTimelinePosts: [],
      profileDescription: '',
    }
    this.retrieveUserInfo()
    this.retrieveLikedPostsByUser()
    this.retrieveLikedCommentsByUser()
    this.retrieveTimelinePosts()
    this.retrieveGlobalTimelinePosts()
    this.retrieveProfileImage()
    this.checkDarkMode()
  }

  // check if dark mode
  checkDarkMode = async () => {
    const body = document.getElementsByTagName("BODY")[0];
    if (localStorage.getItem('darkMode') === 'true') {
      // initiate dark mode
      body.style.color = '#b5b5b5'
      body.style.backgroundColor = '#423f3f'
    }
  }

  // retrieve liked posts by user
  retrieveLikedPostsByUser = async () => {
    const user = localStorage.getItem('plumUser56010')
    // retrieve
    if (user) {
      const response = await fetch('/posts/likedPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: user,
          token: localStorage.getItem('token')
        })
      })
        .catch(err => console.log(err))
      const body = await response.text()
      if (body === 'error') {
        alert('Error occurred retrieving liked posts.')
        return
      }
      const likedPosts = await JSON.parse(body)
      this.setState({
        likedPostsByUser: likedPosts
      })
    }
  }

  // retrieve liked comments by user
  retrieveLikedCommentsByUser = async () => {
    const user = localStorage.getItem('plumUser56010')
    if (user) {
      // retrieve
      const response = await fetch('/comments/' + user + '/likedComments')
      const body = await response.text()
      const likedComments = await JSON.parse(body)
      this.setState({
        likedCommentsByUser: likedComments
      })
    }
  }

  // retrieve info of the user signed in
  retrieveUserInfo = async () => {
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
        this.setState({
          loggedInUserFollowing: parsedBody.following,
          profileDescription: parsedBody.description
        })
      }
    }
  }

  // retrieve the posts which will be in the user's timeline
  retrieveTimelinePosts = async () => {
    if (!localStorage.getItem('plumUser56010')) {
      return
    }
    // retrieve timeline posts for this user
    // (posts from profiles they are following)
    // retrieve posts from last 5 days
    // sorted in most recent order (recent to old)
    const response = await fetch('/posts/timelinePosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body !== 'error') {
      const parsedBody = JSON.parse(body)
      this.setState({
        timelinePosts: parsedBody
      })
    }
  }

  // retrieve globally trending posts
  retrieveGlobalTimelinePosts = async () => {
    const response = await fetch('/posts/globalTimelinePosts')
    const body = await response.text()
    if (body !== 'error') {
      const parsedBody = JSON.parse(body)
      this.setState({
        globalTimelinePosts: parsedBody
      })
    }
  }

  // retrieve the user's profile image (for header)
  retrieveProfileImage = async () => {
    if (localStorage.getItem('plumUser56010')) {
      const response = await fetch(
            '/profile/retrieveProfileImage/' + localStorage.getItem('plumUser56010'))
      const body = await response.text()
      localStorage.setItem('profileImage', body)
    }
  }

  render() {
    return(
      <div>
        <div className="pageContainer">
        < Search />
        <header className="navigation">
          < SiteHeader />
        </header>
        <Switch>
          <Route
            exact path="/"
            render={(props) => (
              <Timeline {...props}
                timelinePosts={this.state.timelinePosts}
                globalTimelinePosts={this.state.globalTimelinePosts}
                likedPostsByUser={this.state.likedPostsByUser}
                likedCommentsByUser={this.state.likedCommentsByUser}
                loggedInUserFollowing={this.state.loggedInUserFollowing}
              />
            )}
           />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/accountCreation" component={AccountCreation} />
          <Route
            exact path="/timeline"
            render={(props) => (
              <Timeline {...props}
                timelinePosts={this.state.timelinePosts}
                globalTimelinePosts={this.state.globalTimelinePosts}
                likedPostsByUser={this.state.likedPostsByUser}
                likedCommentsByUser={this.state.likedCommentsByUser}
                loggedInUserFollowing={this.state.loggedInUserFollowing}
              />
            )}
          />
          <Route
            exact path="/profile/:username"
            render={(props) => (
              <ProfilePage {...props}
                likedPostsByUser={this.state.likedPostsByUser}
                loggedInUserFollowing={this.state.loggedInUserFollowing}
              />
            )}
          />
          <Route
            exact path="/profile/:username/:postId"
            render={(props) => (
              <IndividualPost {...props}
                likedPostsByUser={this.state.likedPostsByUser}
                likedCommentsByUser={this.state.likedCommentsByUser}
              />
            )}
          />
          <Route exact path="/editProfile"
            render={(props) => (
              <EditProfile {...props}
                description={this.state.profileDescription}
              />
            )}
          />
          <Route exact path="/createPost" component={CreatePost} />
          <Route exact path="/settings" component={Settings} />
          <Route
            exact path="/likedPosts"
            render={(props) => (
              <ProfilePage {...props} likedPostsByUser={this.state.likedPostsByUser} />
            )}
          />
          <Route exact path="/admin/a8b010" component={Admin} />
          <Route exact path="/about" component={About} />
          <Route exact path="/faq" component={Faq} />
          <Route exact path="/support" component={Support} />
          <Route exact path="/guidelines" component={Guidelines} />
          <Route exact path="/passwordRecovery" component={PasswordRecovery} />
          <Route exact path="/CreateArticlePost" component={CreateArticlePost} />
        </Switch>
        </div>
      <Footer />
      </div>
    )
  }
}

export default App;
