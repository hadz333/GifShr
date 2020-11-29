import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comment from './Comment';
import { HashLink as Link } from 'react-router-hash-link';

class CommentsSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: this.props.post,
      numComments: this.props.post.comments.length,
      comments: [],
      // boolean, tells whether comments section is on profile
      isFromProfile: this.props.isFromProfile,
    }
  }

  componentDidMount() {
    if (!this.state.isFromProfile) {
      this.displayComments()
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.post !== prevProps.post) {
      await this.setState({
        post: this.props.post,
        comments: [],
        numComments: this.props.post.comments.length,
      })
      this.retrieveComments()
    }
  }

  // function to display comments upon click
  displayComments = async () => {
    const caretDown = document.getElementById("commentsCaretDown" + this.props.post._id);
    const caretUp = document.getElementById("commentsCaretUp" + this.props.post._id);
    const commentsSection = document.getElementById("commentsSection" + this.props.post._id);
    if (caretUp.style.display === 'inline') {
      caretDown.style.display = 'inline'
      caretUp.style.display = 'none'
      commentsSection.style.display = 'none'
    } else {
      caretDown.style.display = 'none'
      caretUp.style.display = 'inline'
      commentsSection.style.display = 'inline'
      this.retrieveComments()
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

  // function to enable/disable button based on if comment text exists
  enableButton = () => {
    const commentTextarea = document.getElementById("commentTextarea" + this.props.post._id);
    const postCommentButton = document.getElementById("postCommentButton" + this.props.post._id);
    if (commentTextarea.value.length > 0) {
      postCommentButton.disabled = false;
      postCommentButton.addEventListener(
        "click", this.handleCommentPost, false
      );
    } else {
      postCommentButton.disabled = true;
      postCommentButton.removeEventListener(
        "click", this.handleCommentPost, false
      );
    }
  }


  // function to handle posting of a comment
  handleCommentPost = async () => {
    if (!localStorage.getItem('plumUser56010')) {
      const mustBeSignedInCommentPost = document.getElementById("mustBeSignedInCommentPost" + this.props.post._id)
      mustBeSignedInCommentPost.style.display = 'inline'
      return
    }
    const commentTextarea = document.getElementById("commentTextarea" + this.props.post._id);
    const response = await fetch('/comments/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commentText: commentTextarea.value,
        postId: this.props.post._id,
        user: localStorage.getItem('plumUser56010'),
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    console.log('body: ' + body)
    if (body === "success") {
      // reset text area to empty and notify user of comment post
      console.log('comment posted')
      commentTextarea.value = ''
      this.setState({
        numComments: this.state.numComments + 1
      })
      this.retrieveComments()
    } else {
      alert("failed to post comment. Please try again.")
    }
  }

  render() {
    if (this.state.isFromProfile && !this.props.isTimeline) {
      return (
        <div id="commentsLink" className="commentsLink">
          <Link
            to={
              "/profile/" + this.state.post.profile
              + '/' + this.state.post.postId
              + "#commentsButton"
            }
          >
            {this.state.post.comments.length} comments
          </Link>
        </div>
      )
    }
    return (
      <div id={"comments" + this.props.post._id} className="comments">
        <button
          id={"commentsButton" + this.props.post._id}
          className="commentsButton"
          onClick={this.displayComments}
        >
          {this.state.numComments} comments
          < FontAwesomeIcon
            icon="caret-down"
            id={"commentsCaretDown" + this.props.post._id}
            className="commentsCaretDown" />
          < FontAwesomeIcon
            icon="caret-up"
            id={"commentsCaretUp" + this.props.post._id}
            className="commentsCaretUp" />
        </button>
        <br />
        <div id={"mustBeSignedInCommentPost" + this.props.post._id} style={{display: 'none', color: 'red'}}>
          <br />
          You must be signed in to perform this action. &nbsp;
          <a href="/login">Sign in here.</a>
        </div>
        <div id={"commentsSection" + this.props.post._id} className="commentsSection" >
          <textarea
            className="form-control commentTextarea"
            id={"commentTextarea" + this.props.post._id}
            placeholder="Write a comment..."
            rows="2"
            onChange={this.enableButton}
          />
          <br />
          <button
            type="button"
            id={"postCommentButton" + this.props.post._id}
            className="btn btn-primary postCommentButton"
            disabled={true}
          >
            Post
          </button>
          {this.state.comments.map((comment, i) => (
              <Comment
                username={comment.profile}
                content={comment.content}
                profileLink={"/profile/" + comment.profile}
                likes={comment.likes}
                replies={comment.replies}
                commentId={comment.id}
                likedCommentsByUser={this.props.likedCommentsByUser}
                key={i}
                isTimeline={this.props.isTimeline}
                postId={this.props.postId}
              />
          ))}
        </div>
      </div>
    )
  }
}

export default CommentsSection;
