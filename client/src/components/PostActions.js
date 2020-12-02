import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportForm from './ReportForm';

import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton
} from "react-share";

import {
  FacebookIcon,
  RedditIcon,
  TwitterIcon
} from "react-share";

// liked vs not liked thumbs ups
const NOT_LIKED = ['far', 'thumbs-up']
const LIKED = ['fas', 'thumbs-up']

// base url for site
const SITE_BASE_URL = 'localhost:3000'

class PostActions extends Component {
  constructor(props) {
    super(props)
    const linkForSharing = SITE_BASE_URL + '/profile/' + this.props.post.profile
                          + '/' + this.props.post.postId
    this.state = {
      post: this.props.post,
      postLikeIcon: NOT_LIKED,
      likedPostsByUser: this.props.likedPostsByUser,
      likes: this.props.post.likes.length,
      likeOrLiked: 'Like',
      likeOrLikes: this.props.post.likes.length === 1 ? 'Like' : 'Likes', // like count plural/singular
      linkToSharePost: linkForSharing
    }
  }

  componentDidMount() {
    this.checkIfLikedByUser()
    this.checkIfPostBelongsToUser()
    this.checkDarkMode()
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.post !== prevProps.post) {
      await this.setState({
        post: this.props.post,
        postLikeIcon: NOT_LIKED,
        likedPostsByUser: this.props.likedPostsByUser,
        likes: this.props.post.likes.length,
        likeOrLiked: 'Like',
        likeOrLikes: this.props.post.likes.length === 1 ? 'Like' : 'Likes',
        linkToSharePost: SITE_BASE_URL + '/profile/' + this.props.post.profile
                              + '/' + this.props.post.postId
      })
      this.checkIfLikedByUser()
      this.checkIfPostBelongsToUser()
      // reset all buttons/menus
      const shareOptions = document.getElementById("shareOptions" + this.state.post._id)
      if (shareOptions.style.display === 'inline') {
        shareOptions.style.display = 'none'
      }
      // reset report
      const reportForm = document.getElementById("reportForm" + this.state.post._id)
      if (reportForm.style.display === 'inline') {
        reportForm.style.display = 'none'
      }
      // reset delete confirmation
      this.hideDeleteConfirmation()
    } else if (this.props.likedPostsByUser !== prevProps.likedPostsByUser) {
      this.checkIfLikedByUser()
    }
  }

  checkDarkMode = async () => {
    const likeButton = document.getElementById(
      "postLikeButton" + this.state.post._id
    )
    const shareButton = document.getElementById(
      "postShareButton" + this.state.post._id
    )
    const reportButton = document.getElementById(
      "postReportButton" + this.state.post._id
    )
    if (localStorage.getItem('darkMode') === 'true') {
      // initiate dark mode
      likeButton.style.color = '#b5b5b5'
      shareButton.style.color = '#b5b5b5'
      reportButton.style.color = '#b5b5b5'
    }
  }

  // check if this post belongs to this user (for delete)
  checkIfPostBelongsToUser = () => {
    const postDeleteButton = document.getElementById("postDeleteButton" + this.state.post._id)
    if (this.state.post.profile === localStorage.getItem('plumUser56010')) {
      postDeleteButton.style.display = 'inline'
    } else {
      postDeleteButton.style.display = 'none'
    }
  }

  // check if this comment was liked by the viewing user
  checkIfLikedByUser = () => {
    for (let i in this.props.likedPostsByUser) {
      if (this.props.likedPostsByUser[i]._id === (this.state.post._id)) {
        this.setState({
          postLikeIcon: LIKED,
          likeOrLiked: 'Liked'
        })
        return
      }
    }
  }

  // when user likes or dislikes a comment
  likePost = async () => {
    // make sure user is signed in
    if (!localStorage.getItem('plumUser56010')) {
      const mustBeSignedIn = document.getElementById("mustBeSignedIn" + this.state.post._id)
      mustBeSignedIn.style.display = 'inline'
      return
    }

    let liked
    if (this.state.postLikeIcon === NOT_LIKED) {
      await this.setState({
        postLikeIcon: LIKED,
        likeOrLiked: 'Liked',
        likeOrLikes: (this.state.likes + 1) === 1 ? 'Like' : 'Likes',
        likes: this.state.likes + 1
      })
      liked = true
    } else {
      await this.setState({
        postLikeIcon: NOT_LIKED,
        likeOrLiked: 'Like',
        likeOrLikes: (this.state.likes - 1) === 1 ? 'Like' : 'Likes',
        likes: this.state.likes - 1
      })
      liked = false
    }
    // add/remove comment to/from likedComments on profile
    // get comment, increase or decrease like count by 1
    const response = await fetch('/posts/userLiked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: this.state.post._id,
        liked: liked,
        likedBy: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body !== "success") {
      if (liked) {
        this.setState({
          likes: this.state.likes - 1
        })
      } else {
        this.setState({
          likes: this.state.likes + 1
        })
      }
      alert("failed to like post. Please check connection and try again.")
    }
  }

  // button clicked to show/hide share post options
  sharePost = () => {
    const shareOptions = document.getElementById("shareOptions" + this.state.post._id)
    if (shareOptions.style.display === 'inline') {
      shareOptions.style.display = 'none'
    } else {
      shareOptions.style.display = 'inline'
    }
  }

  // copy link to specific post (for user to share)
  copyPostLink = async () => {
    const confirmCopy = document.getElementById("copiedLinkConfirmationText" + this.state.post._id)
    const e = document.getElementById("linkToSharePost" + this.state.post._id)
    e.style.display = 'inline'
    e.select()
    e.setSelectionRange(0, 99999); /*For mobile devices*/
    await document.execCommand("copy")
    e.style.display = 'none'
    confirmCopy.style.display = 'inline'
  }

  // button clicked to show/hide report post options
  reportPost = () => {
    const reportForm = document.getElementById("reportForm" + this.state.post._id)
    if (reportForm.style.display === 'inline') {
      reportForm.style.display = 'none'
    } else {
      reportForm.style.display = 'inline'
    }
  }

  // show delete post confirmation message
  showDeleteConfirmation = () => {
    const postDeleteConfirmation = document
      .getElementById("postDeleteConfirmation" + this.state.post._id)
    postDeleteConfirmation.style.display = 'inline'
  }

  // hide delete post confirmation message
  hideDeleteConfirmation = () => {
    const postDeleteConfirmation = document
      .getElementById("postDeleteConfirmation" + this.state.post._id)
    postDeleteConfirmation.style.display = 'none'
  }

  // delete post (only owner can do this)
  deletePost = async () => {
    // show deleted message
    const postDeletedMessage = document.getElementById(
            "postDeletedMessage" + this.state.post._id)
    postDeletedMessage.style.display = 'inline'
    // request API to delete this post
    const response = await fetch('/posts/deletePost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: this.state.post,
        username: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body !== "success"){
      alert("Deleting comment failed. Try again.")
    } else {
      console.log('deleted')
    }
  }

  render() {
    return (
      <div id="postActions">
        <button
          className="commentActionButton postActionButton"
          id={"postLikeButton" + this.state.post._id}
          onClick={this.likePost}
        >
          < FontAwesomeIcon icon={this.state.postLikeIcon} id="postLikeIcon" />
          {this.state.likeOrLiked}
        </button>
        &nbsp;
        <button
          className="commentActionButton postActionButton"
          id={"postShareButton" + this.state.post._id}
          onClick={this.sharePost}
        >
          < FontAwesomeIcon icon="share" id="postShareIcon" />
          Share
        </button>
        &nbsp;
        &nbsp;
        <button
          className="commentActionButton postActionButton postReportButton"
          id={"postReportButton" + this.state.post._id}
          onClick={this.reportPost}
        >
          < FontAwesomeIcon icon='flag' id="postReportIcon"/>
          Report
        </button>
        <button
          className="commentActionButton postActionButton postDeleteButton"
          id={"postDeleteButton" + this.state.post._id}
          onClick={this.showDeleteConfirmation}
          style={{color: '#c91616', marginLeft: '10px', display: 'none', width: '30px'}}
        >
          <FontAwesomeIcon icon={['fas', 'trash-alt']} />
        </button>
        <div
          id={"postDeleteConfirmation" + this.state.post._id}
          style={{display: 'none'}}
        >
          <br />
          Are you sure you want to delete this post?
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.deletePost}
            style={{marginRight: '5px'}}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.hideDeleteConfirmation}
            style={{marginRight: '5px'}}
          >
            No
          </button>
        </div>
        <div
          id={"postDeletedMessage" + this.state.post._id}
          style={{display: 'none'}}>
          This post has been deleted.
        </div>
        <div id={"mustBeSignedIn" + this.state.post._id} style={{display: 'none'}}>
          <br />
          You must be signed in to perform this action. &nbsp;
          <a href="/login">Sign in here.</a>
        </div>
        <div
          id={"reportForm" + this.state.post._id}
          style={{display: 'none'}}
        >
          <br />
          <ReportForm
            isPost={true}
            nsfw={this.state.post.nsfw}
            id={this.state.post._id}
            profile={this.state.post.profile}
          />
        </div>
        <br />
        <div
          id={"shareOptions" + this.state.post._id}
          style={{display: 'none'}}
        >
          <button
            className="commentActionButton postActionButton"
            id={"copyPostLinkButton" + this.state.post._id}
            onClick={this.copyPostLink}
          >
            <FontAwesomeIcon icon={['far', 'clipboard']} />
            &nbsp; Copy
          </button>
          <TwitterShareButton url={this.state.linkToSharePost}
            className="socialMediaShareLink">
            <TwitterIcon round={true} className="socialMediaShareIcon" />
          </TwitterShareButton>
          <RedditShareButton url={this.state.linkToSharePost}
            className="socialMediaShareLink">
            <RedditIcon round={true} className="socialMediaShareIcon" />
          </RedditShareButton>
          <FacebookShareButton url={this.state.linkToSharePost}
            className="socialMediaShareLink">
            <FacebookIcon round={true} className="socialMediaShareIcon" />
          </FacebookShareButton>
          <br />
          <textarea
            value={this.state.linkToSharePost}
            readOnly={true}
            style={{display: 'none'}}
            id={"linkToSharePost" + this.state.post._id}
          />
          <p
            id={"copiedLinkConfirmationText" + this.state.post._id}
            style={{display: 'none'}}
          >
            Copied link to clipboard!
            <br />
          </p>
        </div>
        <strong>{this.state.likes} {this.state.likeOrLikes}</strong>
      </div>
    )
  }
}

export default PostActions;
