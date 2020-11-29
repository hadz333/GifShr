// this component represents the 3-column post grid
// (visible on your profile and when you view another profile)
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SpecificPost from './SpecificPost'

class PostGrid extends Component {

  constructor(props) {
    super(props)
    this.state = {
      posts: this.props.posts
    }
  }

  // if posts array changes (new profile clicked), set new state
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.posts !== prevProps.posts) {
      this.setState({
        posts: this.props.posts
      })
    }
  }

  render() {
    if (this.props.isTimeline === true && this.state.posts.length < 1) {
      return (
        <div style={{textAlign: 'center', margin: '10px'}}>
        <h5>
          Welcome to GifShr! <br /><br />
          Your timeline is currently empty.
          Follow profiles to see their most recent posts here.
        </h5>
        <br />
        <h6 style={{fontWeight: 'normal'}}>
          The menu which can take you to various pages is on the right end at the top of the page. <br /><br />
          To visit your profile, click on your profile picture in the top right, just to the left of the menu. <br /><br />
          You can search for profiles using the search bar at the top, in the middle of the page. <br /><br />
          The app logo on the top left will take you back here to your timeline.
        </h6>
        For more information, visit the <Link to="/about">about</Link> or <Link to="/faq">FAQ</Link> pages.
        </div>
      )
    }

    if (this.props.gridLayout) {
      return (
        <div id="postGrid">
          <div className="individualPic">
            {this.state.posts.map((post, i) => (
              <Link
                key={i}
                to={"/profile/" + post.profile + '/'
                    + post.postId }
              >
                <img
                  key={i}
                  className="postGridPic"
                  id={post.postId}
                  src={post.imageSource}
                  alt="post"
                  style={(post.title || (post.nsfw && !localStorage.getItem('plumUser56010')) || (post.nsfw && (localStorage.getItem('showNsfw') === 'false' || localStorage.getItem('autoShowNsfw') === 'false') )) ? {display: 'none'} : {display: 'inline'}}
                />
              </Link>
            ))}
          </div>
        </div>
      )
    } else {
      // scroll through posts (all post info displayed)
      return (
        <div id="postScroll">
            {this.state.posts.map((post, i) => (
              <div key={i} >
                <SpecificPost
                  post={post}
                  key={i}
                  isFromProfile={true}
                  isTimeline={this.props.isTimeline}
                  likedPostsByUser={this.props.likedPostsByUser}
                  likedCommentsByUser={this.props.likedCommentsByUser}
                />
              </div>
            ))}
        </div>
      )
    }

  }
}
export default PostGrid;
