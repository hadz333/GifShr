import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportForm from './ReportForm';

// liked vs not liked thumbs ups
const NOT_LIKED = ['far', 'thumbs-up']
const LIKED = ['fas', 'thumbs-up']

class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      profileImage: this.props.profileImage,
      content: this.props.content,
      profileLink: this.props.profileLink,
      likes: this.props.likes.length,
      replies: this.props.replies,
      id: this.props.commentId,
      commentLikeIcon: NOT_LIKED,
      repliesLoaded: false,
      likeOrLiked: 'Like', // text next to thumbs up
      likeOrLikes: this.props.likes.length === 1 ? 'Like' : 'Likes', // like count plural/singular
      replyDepth: this.props.replyDepth || 0,
      replyingTo: this.props.replyingTo || ''
    }
    this.retrieveProfileImage(this.props.username)
  }

  componentDidMount() {
    this.checkIfLikedByUser()
    this.checkMarginBarrier()
    this.checkIfCommentBelongsToUser()
  }

  // check if comment belongs to user
  checkIfCommentBelongsToUser = () => {
    if (this.props.username === localStorage.getItem('plumUser56010')) {
      // add delete button to the comment
      const deleteButton = document.getElementById(
                           "commentDeleteButton" + this.state.id)
      deleteButton.style.display = 'inline'
    }
  }

  // check if left margin is past max. If so, set to max.
  // this ensures comment reply chains that go deep don't become unreadable
  checkMarginBarrier = () =>  {
    const thisComment = document.getElementById(this.state.id)

    if (this.props.isReply) {
      thisComment.style.marginLeft = -20 + 'px'
      thisComment.style.marginTop = 10 + 'px'
      //thisComment.style.borderLeft = '1px solid grey'
    }

    if (this.state.replyDepth >= 3) {
      // negate the margin
      thisComment.style.marginLeft = -44 + 'px'
    }

    if (this.state.replyDepth >= 4) {
      thisComment.style.marginLeft = -55 + 'px'
    }

  }

  // check if this comment was liked by the viewing user
  checkIfLikedByUser = async () => {
    if (this.props.likedCommentsByUser.includes(this.props.commentId)) {
      this.setState({
        commentLikeIcon: LIKED,
        likeOrLiked: 'Liked'
      })
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

  // when user likes or dislikes a comment
  likeComment = async () => {
    if (!localStorage.getItem('plumUser56010')) {
      alert("You must be signed in to perform this action.")
      return
    }
    let liked
    if (this.state.commentLikeIcon === NOT_LIKED) {
      await this.setState({
        commentLikeIcon: LIKED,
        likeOrLiked: 'Liked',
        likeOrLikes: (this.state.likes + 1) === 1 ? 'Like' : 'Likes',
        likes: this.state.likes + 1
      })
      liked = true
    } else {
      await this.setState({
        commentLikeIcon: NOT_LIKED,
        likeOrLiked: 'Like',
        likeOrLikes: (this.state.likes - 1) === 1 ? 'Like' : 'Likes',
        likes: this.state.likes - 1
      })
      liked = false
    }
    // add/remove comment to/from likedComments on profile
    // get comment, increase or decrease like count by 1
    const response = await fetch('/comments/userLiked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentId: this.state.id,
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
      alert("failed to like comment. Please check connection and try again.")
    }

  }

  // when user wants to show or hide replies on a specific comment
  displayReplies = async () => {
    const commentReplies = document.getElementById("commentReplies" + this.state.id)
    const caretDown = document.getElementById("commentsCaretDown" + this.state.id);
    const caretUp = document.getElementById("commentsCaretUp" + this.state.id);
    if (caretUp.style.display === 'inline') {
      commentReplies.style.display = 'none'
      caretDown.style.display = 'inline'
      caretUp.style.display = 'none'
    } else {
      commentReplies.style.display = 'inline'
      caretDown.style.display = 'none'
      caretUp.style.display = 'inline'
      this.retrieveCommentReplies()
    }
  }

  // reply to comment button clicked
  replyToComment = async () => {
    const commentReplyForm = document.getElementById("commentReplyForm" + this.state.id);
    if (commentReplyForm.style.display === 'inline') {
      commentReplyForm.style.display = 'none'
    } else {
      commentReplyForm.style.display = 'inline'
    }
  }

  // function to enable/disable button based on if comment text exists
  enableButton = () => {
    const replyToCommentTextarea = document.getElementById("replyToCommentTextarea" + this.state.id);
    const postCommentReplyButton = document.getElementById("postCommentReplyButton" + this.state.id);
    if (replyToCommentTextarea.value.length > 0) {
      postCommentReplyButton.disabled = false;
      postCommentReplyButton.addEventListener(
        "click", this.handleCommentReplyPost, false
      );
    } else {
      postCommentReplyButton.disabled = true;
      postCommentReplyButton.removeEventListener(
        "click", this.handleCommentReplyPost, false
      );
    }
  }

  // function to retrieve comments for this post
  retrieveComments = async () => {
    const postId = this.state.post._id
    const response = await fetch('/comments/' + postId)
    const body = await response.text()
    if (body) {
      const parsedBody = JSON.parse(body)
      // reset text area to empty and notify user of comment post
      let commentsArr = []
      for (let i in parsedBody) {
        await commentsArr.push({
          profile: parsedBody[i].profile,
          content: parsedBody[i].content,
          likes: parsedBody[i].likes,
          replies: parsedBody[i].replies,
          id: parsedBody[i]._id
        })
      }
      this.setState({
        comments: commentsArr
      })
    } else {
      alert("failed to retrieve comments.")
    }
  }

  // function to handle posting of a comment (reply)
  handleCommentReplyPost = async () => {
    if (!localStorage.getItem('plumUser56010')) {
      alert('You must be signed in to perform this action.')
      return
    }
    const replyToCommentTextarea = document.getElementById("replyToCommentTextarea" + this.state.id)
    const postCommentReplyButton = document.getElementById("postCommentReplyButton" + this.state.id)
    console.log('here')
    const response = await fetch('/comments/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentText: replyToCommentTextarea.value,
        commentToAddReply: this.state.id,
        user: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    console.log('body: ' + body)
    if (body === "success") {
      // reset text area to empty and notify user of comment post
      console.log('comment posted')
      // reset and remove comment reply form after successful post
      replyToCommentTextarea.value = ''
      postCommentReplyButton.disabled = true
      replyToCommentTextarea.style.display = 'none'
      postCommentReplyButton.style.display = 'none'
      this.retrieveCommentReplies()
    } else {
      alert("failed to post comment. Please check connection and try again.")
    }
  }

  // function to retrieve replies for this comment
  retrieveCommentReplies = async () => {
    const commentId = this.state.id
    const response = await fetch('/comments/replies/' + commentId)
    const body = await response.text()
    if (body) {
      const parsedBody = JSON.parse(body)
      let commentsArr = []
      for (let i in parsedBody) {
        await commentsArr.push({
          profile: parsedBody[i].profile,
          content: parsedBody[i].content,
          likes: parsedBody[i].likes,
          replies: parsedBody[i].replies,
          id: parsedBody[i]._id
        })
      }
      await this.setState({
        replies: commentsArr,
        repliesLoaded: true
      })
    } else {
      alert("failed to retrieve replies.")
    }
  }

  // button clicked to show/hide report comment options
  reportComment = () => {
    const reportForm = document.getElementById("reportForm" + this.state.id)
    const thisComment = document.getElementById(this.state.id)

    if (reportForm.style.display === 'inline') {
      reportForm.style.display = 'none'
      if (this.state.replyDepth >= 4) {
        // 55
        thisComment.style.marginLeft = -55 + 'px'
      } else if (this.state.replyDepth >= 3) {
        // 44
        thisComment.style.marginLeft = -44 + 'px'
      } else if (this.state.isReply) {
        thisComment.style.marginLeft = -20 + 'px'
      }
    } else {
      reportForm.style.display = 'inline'
      thisComment.style.marginLeft = 0 + 'px'
    }
  }

  // delete comment (only owner can do so)
  deleteComment = async () => {
    // request API to delete this comment
    const response = await fetch('/comments/deleteComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token'),
        commentId: this.state.id,
        postId: this.props.postId
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
    let content = this.state.content

    // reply comment prestring
    let preReplyString = ''
    if (this.state.replyingTo) {
      preReplyString = '@' + this.state.replyingTo + ' '
    }

    // plural or singular check for counters
    let replyOrReplies = ''
    if (this.state.replies.length === 1) {
      replyOrReplies = 'Reply'
    } else {
      replyOrReplies = 'Replies'
    }

    let newLine
    if (!this.props.isTimeline) {
      newLine = <br />
    }
    if (this.state.repliesLoaded) {
      return (
        <div className="media comment" id={this.state.id}>
          <a href={this.state.profileLink}>
            <img
              id="searchResultPic"
              src= {
                this.state.profileImage
              }
              className="mr-3"
              alt="profile"
            />
          </a>
          <div className="media-body" id="profilePreviewDetails">
            <a href={this.state.profileLink} style={{color: ''}}>
              <h6 className="mt-0 mb-0" id="profilePreviewName">
                {this.state.username}
              </h6>
            </a>
            {newLine}
            {preReplyString}{content} <br />
            <button
              className="commentActionButton"
              id={"commentLikeButton" + this.state.id}
              onClick={this.likeComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
              <FontAwesomeIcon
                icon={this.state.commentLikeIcon}
              />
                {this.state.likeOrLiked}
            </button>
            {this.state.likes} {this.state.likeOrLikes}
            <button
              className="commentActionButton"
              id="displayRepliesButton"
              onClick={this.displayReplies}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
            {this.state.replies.length + ' ' + replyOrReplies}
            < FontAwesomeIcon
              icon="caret-down"
              className="commentsCaretDown"
              id={"commentsCaretDown" + this.state.id}
            />
            < FontAwesomeIcon
              icon="caret-up"
              className="commentsCaretUp"
              id={"commentsCaretUp" + this.state.id}
            />
            </button>
            <button
              className="commentActionButton"
              id="replyToCommentButton"
              onClick={this.replyToComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
              Reply
            </button>
            <button
              className="commentActionButton"
              id="commentReportButton"
              onClick={this.reportComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
            Report
            </button>
            <button
              className="commentActionButton"
              id={"commentDeleteButton" + this.state.id}
              onClick={this.deleteComment}
              style={{color: '#c91616', display: 'none', marginLeft: '5px', width: '20px'}}
            >
            <FontAwesomeIcon icon={['fas', 'trash-alt']} />
            </button>
            <br />
            <div
              id={"reportForm" + this.state.id}
              style={{display: 'none'}}
            >
              <ReportForm
                isPost={false}
                id={this.state.id}
                profile={this.state.username}
              />
              <br />
            </div>
            <div
              id={"commentReplyForm" + this.state.id}
              className="commentReplyForm"
            >

              <textarea
                id={"replyToCommentTextarea" + this.state.id}
                className="form-control"
                placeholder="Reply to comment..."
                rows="2"
                onChange={this.enableButton}
              />
              <button
                type="button"
                id={"postCommentReplyButton" + this.state.id}
                className="btn btn-primary"
                disabled={true}
              >
              Post reply
              </button>
              <br />
            </div>
            <div
              id={"commentReplies" + this.state.id}
              className="commentReplies"
            >
            {this.state.replies.map((comment, i) => (
                <Comment
                  username={comment.profile}
                  content={comment.content}
                  profileLink={"/profile/" + comment.profile}
                  likes={comment.likes}
                  replies={comment.replies}
                  commentId={comment.id}
                  isReply={true}
                  replyDepth={this.state.replyDepth + 1}
                  replyingTo={this.state.username}
                  likedCommentsByUser={this.props.likedCommentsByUser}
                  postId={this.props.postId}
                  key={i}
                />
            ))}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="media comment" id={this.state.id}>
          <a href={this.state.profileLink}>
            <img
              id="searchResultPic"
              src= {
                this.state.profileImage
              }
              className="mr-3"
              alt="profile"
            />
          </a>
          <div className="media-body" id="profilePreviewDetails">
            <a href={this.state.profileLink}>
              <h6 className="mt-0 mb-0" id="profilePreviewName">
                {this.state.username}
              </h6>
            </a>
            {newLine}
            {preReplyString}{content} <br />
            <button
              className="commentActionButton"
              id="commentLikeButton"
              onClick={this.likeComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
              < FontAwesomeIcon icon={this.state.commentLikeIcon} />
              {this.state.likeOrLiked}
            </button>
            {this.state.likes} {this.state.likeOrLikes}
            <button
              className="commentActionButton"
              id="displayRepliesButton"
              onClick={this.displayReplies}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
            {this.state.replies.length + ' ' + replyOrReplies}
            < FontAwesomeIcon
              icon="caret-down"
              className="commentsCaretDown"
              id={"commentsCaretDown" + this.state.id}
            />
            < FontAwesomeIcon
              icon="caret-up"
              className="commentsCaretUp"
              id={"commentsCaretUp" + this.state.id}
            />
            </button>
            <button
              className="commentActionButton"
              id="replyToCommentButton"
              onClick={this.replyToComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
              Reply
            </button>
            <button
              className="commentActionButton"
              id="commentReportButton"
              onClick={this.reportComment}
              style={localStorage.getItem('darkMode') === 'true' ? {color: '#b5b5b5'} : {color: 'black'}}
            >
            Report
            </button>
            <button
              className="commentActionButton"
              id={"commentDeleteButton" + this.state.id}
              onClick={this.deleteComment}
              style={{color: '#c91616', display: 'none', marginLeft: '5px', width: '20px'}}
            >
            <FontAwesomeIcon icon={['fas', 'trash-alt']} />
            </button>
            <br />
            <div
              id={"reportForm" + this.state.id}
              style={{display: 'none'}}
            >
              <ReportForm
                isPost={false}
                id={this.state.id}
                profile={this.state.username}
              />
              <br />
            </div>
            <div
              id={"commentReplyForm" + this.state.id}
              className="commentReplyForm"
            >

              <textarea
                id={"replyToCommentTextarea" + this.state.id}
                className="form-control"
                placeholder="Reply to comment..."
                rows="2"
                onChange={this.enableButton}
              />
              <button
                type="button"
                id={"postCommentReplyButton" + this.state.id}
                className="btn btn-primary"
                disabled={true}
              >
              Post reply
              </button>
              <br />
            </div>
            <div
              id={"commentReplies" + this.state.id}
              className="commentReplies"
            >
              Loading replies...
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Comment;
