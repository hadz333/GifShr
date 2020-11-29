import React, { Component } from 'react';

// max description preview length
const MAX_DESCRIPTION_PREVIEW_LENGTH = 40

class ProfilePreview extends Component {
  constructor(props) {
    super(props)
    // check if nsfw profile pic and user viewing has nsfw disabled. If so, don't render
    if (this.props.isProfilePicNsfw && (localStorage.getItem('autoShowNsfw') !== 'true')) {
      this.state = {
        username: this.props.username,
        profileImage: '/nsfw_post_in_grid_with_auto_nsfw_off.png',
        description: this.props.description,
        isComment: this.props.isComment
      }
    } else {
      this.state = {
        username: this.props.username,
        profileImage: this.props.profileImage,
        description: this.props.description,
        isComment: this.props.isComment
      }
    }
  }

  render() {
    let desc = this.state.description
    if (desc && !this.state.isComment) {
      if (desc.length > MAX_DESCRIPTION_PREVIEW_LENGTH) {
        desc = desc.substring(0, MAX_DESCRIPTION_PREVIEW_LENGTH) + "..."
      }
    }

    return (
      <div className="media" id="profilePreview">
        <img
          id="searchResultPic"
          src= {
            this.state.profileImage
          }
          className="mr-3"
          alt="profile"
        />
        <div className="media-body" id="profilePreviewDetails">
          <h6 className="mt-0 mb-0" id="profilePreviewName">{this.state.username}</h6>
          {desc}
        </div>
      </div>
    )
  }
}

export default ProfilePreview;
