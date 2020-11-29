import React, { Component } from 'react';
import '../styles/SpecificPost.css';
import CommentsSection from './CommentsSection';
import PostActions from './PostActions';

const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const DAYS_IN_MONTH = 30
const MONTHS_IN_YEAR = 12

class SpecificPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileImage: '',
      post: this.props.post,
      imageSource: ((!localStorage.getItem('plumUser56010') && this.props.post.nsfw) || (this.props.post.nsfw &&
        (localStorage.getItem('showNsfw') === 'false' ||
        localStorage.getItem('autoShowNsfw') === 'false'))) ?
        '/nsfw_post_in_grid_with_auto_nsfw_off.png' : this.props.post.imageSource
    }
    this.retrieveProfileImage(this.props.post.profile)
  }

  componentDidMount() {
    this.checkIfTimeline()
    this.checkDarkMode()
    this.checkNsfwStatus()

    // check if darkmode for background color of posts
    if (localStorage.getItem('darkMode') === 'true') {
      const textPost = document.getElementById("specifiedPostContent" + this.state.post._id)
      textPost.style.background = '#515151'
      const specifiedPostVideo = document.getElementById("specifiedPostVideo" + this.state.post._id)
      specifiedPostVideo.style.background = '#515151'
      specifiedPostVideo.style.borderTop = '2px solid black'
      specifiedPostVideo.style.borderBottom = '2px solid black'
    }
  }

  checkNsfwStatus = () => {

    if (this.state.post.nsfw) {
      // if not signed in
      if (!localStorage.getItem('plumUser56010')) {
        this.setState({
          imageSource: '/nsfw_post_not_signed_in.png'
        })
        return
      }

      if (localStorage.getItem('showNsfw') === 'true') {
        if (localStorage.getItem('autoShowNsfw') === 'false') {
          // show click to show NSFW
          this.setState({
            imageSource: '/nsfw_post_with_nsfw_on_auto_off.png'
          })
        }
      } else {
        // show signed in with nsfw off
        this.setState({
          imageSource: '/nsfw_post_with_nsfw_off.png'
        })
      }
    } else {
      this.setState({
        imageSource: this.props.post.imageSource
      })
    }
  }

  // check if dark mode is toggled on
  checkDarkMode = async () => {
    const postPic = document.getElementById(
      "specifiedPostPic" + this.state.post._id
    );
    if (localStorage.getItem('darkMode') === 'true') {
      // initiate dark mode
      postPic.style.borderTop = '2px solid black'
      postPic.style.borderBottom = '2px solid black'
      postPic.style.background = '#525252'
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.post !== prevProps.post) {
      await this.setState({
        post: this.props.post,
        imageSource: ((!localStorage.getItem('plumUser56010') && this.props.post.nsfw) || (this.props.post.nsfw &&
          (localStorage.getItem('showNsfw') === 'false' ||
          localStorage.getItem('autoShowNsfw') === 'false'))) ?
          '/nsfw_post_in_grid_with_auto_nsfw_off.png' : this.props.post.imageSource
      })
      this.retrieveProfileImage(this.props.post.profile)
      this.checkIfTimeline()
      this.checkDarkMode()
      this.checkNsfwStatus()
    }
  }

  checkIfTimeline = () => {
    const timelineProfileLink = document.getElementById("timelineProfileLink" + this.state.post._id)
    if (this.props.isTimeline) {
      timelineProfileLink.style.display = 'inline'
    }
  }

  // function to retrieve profile image (for each comment)
  retrieveProfileImage = async (user) => {
    try {
      const response =
        await fetch('/profile/retrieveProfileImage/' + user)
      const body = await response.text()
      this.setState({
        profileImage: body
      })
    } catch(err) {
      console.error(err)
    }
  }

  // display nsfwImage
  displayNsfwImage = () => {
    if (this.state.post.nsfw) {
      if (localStorage.getItem('showNsfw') === 'true') {
        if (localStorage.getItem('autoShowNsfw') === 'false') {
          // show click to show NSFW
          this.setState({
            imageSource: this.props.post.imageSource
          })
        }
      }
    }
  }

  // unveil a nsfw video
  unveilVideo = () => {
    const video = document.getElementById('video' + this.state.post._id)
    const videoNsfwPic1 = document.getElementById("videoNsfwPic1" + this.state.post._id)
    const videoNsfwPic2 = document.getElementById("videoNsfwPic2" + this.state.post._id)
    const videoNsfwPic3 = document.getElementById("videoNsfwPic3" + this.state.post._id)
    videoNsfwPic1.style.display = 'none'
    videoNsfwPic2.style.display = 'none'
    videoNsfwPic3.style.display = 'none'
    video.style.display = 'block'
  }

  render() {
    // if data is not loaded, do not render
    if (!this.props.likedPostsByUser && !this.props.isAdmin) {
      return (
        <div
          style={{textAlign: "center"}}>
          Loading post...
        </div>
      )
    }

    const currTime = new Date()
    // getting the time since post (in minutes)
    // and setting the time tag on post
    let timeSincePost =
      (currTime - new Date(this.state.post.creationDate)) / 1000
    timeSincePost /= 60
    timeSincePost = parseInt(timeSincePost)

    let postTimeTag = ''
    if (timeSincePost < MINUTES_IN_HOUR) {
      postTimeTag = timeSincePost + ' minutes ago'
      if (timeSincePost === 1) {
        postTimeTag = timeSincePost + ' minute ago'
      }
    } else if (timeSincePost < MINUTES_IN_HOUR * HOURS_IN_DAY) {
      const hoursAgo = parseInt(timeSincePost / MINUTES_IN_HOUR)
      postTimeTag = hoursAgo + ' hours ago'
      if (hoursAgo === 1) {
        postTimeTag = hoursAgo + ' hour ago'
      }
    } else if (timeSincePost < MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH) {
      const daysAgo = parseInt(
        timeSincePost / MINUTES_IN_HOUR / HOURS_IN_DAY
      )
      postTimeTag = daysAgo + ' days ago'
      if (daysAgo === 1) {
          postTimeTag = daysAgo + ' day ago'
      }

    } else if (timeSincePost < MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH * MONTHS_IN_YEAR) {
      const monthsAgo = parseInt(
        timeSincePost / MINUTES_IN_HOUR / HOURS_IN_DAY / DAYS_IN_MONTH
      )
      postTimeTag = monthsAgo + ' months ago'
      if (monthsAgo === 1) {
        postTimeTag = monthsAgo + ' month ago'
      }
    } else {
      // years ago
      const yearsAgo = parseInt(
        timeSincePost / MINUTES_IN_HOUR / HOURS_IN_DAY / DAYS_IN_MONTH / MONTHS_IN_YEAR
      )
      postTimeTag = yearsAgo + ' years ago'
      if (yearsAgo === 1) {
        postTimeTag = yearsAgo + ' year ago'
      }
    }

    let parsedVideoLink
    if (this.state.post.videoLink) {
      if (!this.state.post.nsfw) {
        let videoId = this.state.post.videoLink.split('watch?v=')[1]
        if (videoId.includes('&')) {
          videoId = videoId.split('&')[0]
        }
        parsedVideoLink = 'https://www.youtube-nocookie.com/embed/' + videoId
      } else {
        let videoId = this.state.post.videoLink.split('viewkey=')[1]
        parsedVideoLink = 'https://www.hub.com/embed/' + videoId
      }
    }


    return (
      <div
        id={this.state.post.postId}
      >
        <div
          id={"timelineProfileLink" + this.state.post._id}
          style={{
            display: 'none',
            paddingLeft: '1%'
          }}
        >
          <a
            href={"/profile/" + this.state.post.profile}
            style={
              localStorage.getItem('darkMode') === 'true' ?
              {color: '#b5b5b5', textDecoration: 'none'} :
              {color: 'black', textDecoration: 'none'}}>
          <img
            id="profilePicturePreview"
            src={
              process.env.PUBLIC_URL +
              this.state.profileImage
            }
            alt="profile"
          />
          &nbsp;
          <strong>{this.state.post.profile}</strong>
          </a>
        </div>
        <div id={"specifiedPostPic" + this.state.post._id}
          className="specifiedPostPic"
          style={this.state.post.title || this.state.post.videoLink ? {display: 'none'}: {display: 'block'}}>
          <img
            id="postPic"
            src={process.env.PUBLIC_URL + this.state.imageSource}
            alt="post"
            onClick={this.displayNsfwImage}
          />
        </div>
        <div id={"specifiedPostContent" + this.state.post._id}
          className="specifiedPostContent card"
          style={this.state.post.title ? {display: 'block', marginTop: '5px'}: {display: 'none'}}>
          <h4 className="card-title" style={{marginLeft: '2%'}}>{this.state.post.title}</h4>
          <p className="card-text" style={{marginLeft: '2%'}}>{this.state.post.content}</p>
        </div>
        <div id={"specifiedPostVideo" + this.state.post._id}
          className="specifiedPostVideo"
          style={this.state.post.videoLink ? {display: 'block'}: {display: 'none'}}>
          <iframe
            id = {'video' + this.state.post._id}
            className="videoPost"
            title="video"
            height="500vh"
            src={parsedVideoLink}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={
              (this.state.post.nsfw &&
              localStorage.getItem('autoShowNsfw') === 'false') ||
              !localStorage.getItem('plumUser56010') ?
              {display: 'none'} : {display: 'block'}}
          >
          </iframe>
          <img
            id={"videoNsfwPic1" + this.state.post._id}
            className="videoNsfwPosterPic"
            src="/nsfw_post_with_nsfw_off.png"
            style={
              this.state.post.nsfw &&
              localStorage.getItem('showNsfw') === 'false' ?
              {display: 'block'} : {display: 'none'}
            }
            alt="nsfw"
          />
          <img
            id={"videoNsfwPic2" + this.state.post._id}
            className="videoNsfwPosterPic"
            src='/nsfw_post_with_nsfw_on_auto_off.png'
            style={
              this.state.post.nsfw &&
              localStorage.getItem('showNsfw') === 'true' &&
              localStorage.getItem('autoShowNsfw') === 'false' ?
              {display: 'block'} : {display: 'none'}
            }
            alt="nsfw"
            onClick={this.unveilVideo}
          />
          <img
            id={"videoNsfwPic3" + this.state.post._id}
            src='/nsfw_post_not_signed_in.png'
            className="videoNsfwPosterPic"
            style={
              this.state.post.nsfw &&
              !localStorage.getItem('plumUser56010') ?
              {display: 'block'} : {display: 'none'}
            }
            alt="nsfw"
          />
        </div>
        <div
          id="specifiedPostInteractiveSection"
        >
          <PostActions
            post={this.state.post}
            likedPostsByUser={this.props.likedPostsByUser}
          />
          <p id="postDetails">
            {this.state.post.description}
            <br />
            {postTimeTag}
          </p>
          <CommentsSection
            post={this.state.post}
            isFromProfile={this.props.isFromProfile}
            isTimeline={this.props.isTimeline}
            likedCommentsByUser={this.props.likedCommentsByUser}
            postId={this.state.post._id}
          />
        </div>
      </div>
    )
  }
}

export default SpecificPost;
