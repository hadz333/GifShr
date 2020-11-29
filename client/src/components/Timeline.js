import React, { Component } from 'react';
import PostGrid from './PostGrid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Timeline extends Component {
  constructor(props) {
    super(props)
    if (!localStorage.getItem('plumUser56010')) {
      this.state = {
        globalTimeline: true,
      }
    } else {
      this.state = {
        globalTimeline: false,
      }
    }
  }

  // handle toggle between global timeline and user timeline
  handleSwitchToggle = (e) => {
    const checked = e.target.checked
    if (checked) {
      this.setState({
        globalTimeline: true
      })
    } else {
      this.setState({
        globalTimeline: false
      })
    }
  }

  render() {
    return (
      <div id="timeline">
        <div style={localStorage.getItem('plumUser56010') ? {textAlign: 'center'} : {display: 'none'}}>
          <FontAwesomeIcon icon="globe" /> View Trending Posts  &emsp;
          <label className="switch">
            <input
              name="layoutSwitch"
              type="checkbox"
              checked={this.state.globalTimeline}
              onChange={(event) => this.handleSwitchToggle(event)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <h4 style={localStorage.getItem('plumUser56010') ? {display: 'none'} : {textAlign: 'center'}}>Trending Worldwide</h4>
        <PostGrid
          gridLayout={false}
          posts={this.state.globalTimeline ? this.props.globalTimelinePosts : this.props.timelinePosts}
          likedPostsByUser={this.props.likedPostsByUser}
          likedCommentsByUser={this.props.likedCommentsByUser}
          isTimeline={true}
          url={window.location.href}
        />
      </div>
    )
  }
}

export default Timeline;
