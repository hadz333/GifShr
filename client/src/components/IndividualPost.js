import React, { Component } from 'react';
import SpecificPost from './SpecificPost';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HashLink as Link } from 'react-router-hash-link';

// individual post which takes up the whole page
class IndividualPost extends Component {

  constructor(props) {
    super(props)
    this.state = {
      post: null,
      profileExists: true,
      user: '',
      postId: 0,
      profileImage: '',
      marginLeft: 20
    }
  }

  componentDidMount() {
    this.retrievePost()
      .catch(err => console.log(err))
  }

  retrievePost = async () => {
    // we will retrieve post using URL data
    const current_url = window.location.href
    const usefulInfo = current_url.split('profile/')[1]
    const user = usefulInfo.split('/')[0]
    const postId = usefulInfo.split('/')[1]

    // retrieve the corresponding post
    const response = await fetch('/posts/' + user + '/' + postId)
    const body = await response.text()
    const errMessage = "profile does not exist."
    if (body === errMessage) {
      this.setState({
        profileExists: false
      })
    } else {
      const parsedBody = JSON.parse(body)
      this.setState({
        post: parsedBody,
        user: user,
        postId: postId
      })
      this.retrieveProfileImage(user)
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

  render() {
    if (this.state.post) {
      // return post
      return (
        <div id="singlePost">
          <div id="individualPostHeader">
            <Link
              to={"/profile/" + this.state.user + "#" + this.state.postId.split('#')[0] }>
            < FontAwesomeIcon icon="arrow-left" id="individualPostBackArrow"
              style={
                localStorage.getItem('darkMode') === 'true' ?
                {color: '#b5b5b5'} :
                {color: 'black'}}/>
            </Link>
            <br />
            <br />
            <a href={"/profile/" + this.state.post.profile}
              style={
                localStorage.getItem('darkMode') === 'true' ?
                {color: '#b5b5b5'} :
                {color: 'black'}}>
            <img
              id="profilePicturePreview"
              src={
                process.env.PUBLIC_URL +
                this.state.profileImage
              }
              alt="profile"
            />
            &nbsp;
            <strong>{this.state.user}</strong>
            </a>
          </div>
          <SpecificPost
            post={this.state.post}
            isFromProfile={false}
            likedPostsByUser={this.props.likedPostsByUser}
            likedCommentsByUser={this.props.likedCommentsByUser}
          />
        </div>
      )
    } else if (!this.state.profileExists) {
      return "profile does not exist."
    } else {
      return "post does not exist."
    }
  }
}

export default IndividualPost;
