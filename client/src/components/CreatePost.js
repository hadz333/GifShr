import React, { Component } from 'react';
import '../styles/CreatePost.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MAX_FILE_SIZE = 10000000 // 10 MB

class CreatePost extends Component {
  constructor(props){
    super(props)
    this.state = {
      file: null,
      readyToPost: false,
      imagePost: true,
      textPost: false,
      videoPost: false,
      displayPreview: false,
      postIsNSFW: false,
      postIsNotNSFW: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  enableButtonCheck = () => {
    // if a legit file is entered
    // AND one NSFW option is selected
    // enable the post submission button
    if (this.state.file !== null) {
      const postIsNSFWCheckbox = document.getElementById('postIsNSFW')
      const postIsNotNSFWCheckbox = document.getElementById('postIsNotNSFW')
      if (postIsNSFWCheckbox.checked || postIsNotNSFWCheckbox.checked) {
        document.getElementById("formSubmitButton").disabled = false
      } else {
        document.getElementById("formSubmitButton").disabled = true
      }
    } else {
      document.getElementById("formSubmitButton").disabled = true
    }
  }

  async handleChange(event) {
    try {
      await this.setState({
        file: URL.createObjectURL(event.target.files[0])
      })
      const fileUploadInput = document.getElementById('fileUploadInput')

      // file size check
      const fileUploadSize = fileUploadInput.files.item(0).size
      if (fileUploadSize > MAX_FILE_SIZE) {
        await this.setState({
          file: null,
          displayPreview: false
        })
        document.getElementById("formSubmitButton").disabled = true;
        document.getElementById("fileSizeError").style.display = 'inline'
        return
      } else {
        document.getElementById("fileSizeError").style.display = 'none'
      }

      const separated = fileUploadInput.value.split('.')
      // get the last part separated by . (file type)
      const fileType = separated[separated.length - 1]
      if (fileType === 'png' ||
        fileType === 'jpg' ||
        fileType === 'jpeg' ||
        fileType === 'gif') {

        // valid
        this.enableButtonCheck()
        document.getElementById("fileTypeError").style.display = 'none'
        this.setState({
          displayPreview: true
        })
      } else {
        this.setState({
          file: null,
          displayPreview: false
        })
        document.getElementById("formSubmitButton").disabled = true;
        document.getElementById("fileTypeError").style.display = 'inline'
      }

    } catch(err) {
      console.log(err)
      this.setState({
        file: null
      })
      document.getElementById("formSubmitButton").disabled = true;
    }
  }

  // toggle different post upload type
  togglePostType = (e) => {
    const button = e.target
    const newPostImageButton = document.getElementById('newPostImageButton')
    const newPostTextButton = document.getElementById('newPostTextButton')
    const newPostVideoButton = document.getElementById('newPostVideoButton')
    switch (button.id) {
      case 'newPostImageButton':
        newPostImageButton.className = 'btn btn-primary newPostButton'
        newPostTextButton.className = 'btn btn-secondary newPostButton'
        newPostVideoButton.className = 'btn btn-secondary newPostButton'
        this.setState({
          imagePost: true,
          textPost: false,
          videoPost: false,
        })
        break;
      case 'newPostTextButton':
        newPostImageButton.className = 'btn btn-secondary newPostButton'
        newPostTextButton.className = 'btn btn-primary newPostButton'
        newPostVideoButton.className = 'btn btn-secondary newPostButton'
        this.setState({
          imagePost: false,
          textPost: true,
          videoPost: false,
        })
        break;
      case 'newPostVideoButton':
        newPostImageButton.className = 'btn btn-secondary newPostButton'
        newPostTextButton.className = 'btn btn-secondary newPostButton'
        newPostVideoButton.className = 'btn btn-primary newPostButton'
        this.setState({
          imagePost: false,
          textPost: false,
          videoPost: true,
        })
        break;
      case 'newPostHubButton':
        newPostImageButton.className = 'btn btn-secondary newPostButton'
        newPostTextButton.className = 'btn btn-secondary newPostButton'
        newPostVideoButton.className = 'btn btn-secondary newPostButton'
        this.setState({
          imagePost: false,
          textPost: false,
          videoPost: false,
        })
        break;
      default:
        break
    }
    this.openPostTypeMenu()
  }

  // submit new text post
  submitTextPost = async () => {
    const textPostTitle = document.getElementById('textPostTitle')
    const textPostContent = document.getElementById('textPostContent')
    const title = textPostTitle.value
    const content = textPostContent.value
    if (title.length < 1) {
      // show title error message and don't move on to api
      const textPostTitleError = document.getElementById('textPostTitleError')
      textPostTitleError.style.display = 'inline'
      return
    }

    // submit the new post to api
    const response = await fetch('/posts/' + localStorage.getItem('plumUser56010')
     + '/createTextPost', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         title: title,
         content: content,
         token: localStorage.getItem('token')
       })
     })
    const body = await response.text()
    if (body === 'error') {
      alert('Unable to publish post. Please try again later.')
    } else {
      // redirect
      window.location.replace("/profile/" + localStorage.getItem('plumUser56010'));
    }
  }

  // submit new video post
  submitVideoPost = async () => {
    const videoPostDescription = document.getElementById('videoPostDescription')
    const videoPostURL = document.getElementById('videoPostURL')
    const videoLink = videoPostURL.value
    // URL verification here
    if (videoLink.length < 1) {
      // show video post error message and don't move on to api
      const videoPostError = document.getElementById('videoPostError')
      videoPostError.style.display = 'inline'
      return
    }

    // ensure valid url
    if (!videoLink.startsWith('https://www.youtube.com/watch?v=')) {
      // show video post error message and don't move on to api
      const videoPostError = document.getElementById('videoPostError')
      videoPostError.style.display = 'inline'
      return
    }

    // submit the new post to api
    const response = await fetch('/posts/' + localStorage.getItem('plumUser56010')
     + '/createVideoPost', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         videoLink: videoLink,
         description: videoPostDescription.value,
         token: localStorage.getItem('token')
       })
     })
    const body = await response.text()
    console.log(body)
    if (body === 'error') {
      alert('Unable to publish post. Please try again later.')
    } else {
      // redirect
      window.location.replace("/profile/" + localStorage.getItem('plumUser56010'));
    }
  }

  // nsfw checkbox checked or unchecked
  nsfwCheckboxAction = (e) => {
    const postIsNSFWCheckbox = document.getElementById('postIsNSFW')
    const postIsNotNSFWCheckbox = document.getElementById('postIsNotNSFW')
    if (postIsNSFWCheckbox.checked && postIsNotNSFWCheckbox.checked) {
      if (e.target.id === 'postIsNSFW') {
        postIsNotNSFWCheckbox.checked = false
      } else {
        postIsNSFWCheckbox.checked = false
      }
    }
    this.enableButtonCheck()
  }

  // open/close post type menu
  openPostTypeMenu = () => {
    const choosePostTypeMenu = document.getElementById('choosePostType')
    if (choosePostTypeMenu.style.display === 'none') {
      choosePostTypeMenu.style.display = 'inline'
    } else {
      choosePostTypeMenu.style.display = 'none'
    }
  }

  render() {
    if (!localStorage.getItem('plumUser56010')) {
      return (
        <h2 style={{textAlign: 'center'}}>Sign in to create a post.</h2>
      )
    }
    return (
      <div id="postUpload">
        <button
          className="btn btn-info"
          id="changePostType"
          onClick={this.openPostTypeMenu}
          style={{width: '60%', margin: 'auto'}}
        >
          Change post type &nbsp;
          < FontAwesomeIcon
            icon="caret-down"
          />
        </button>
        <div id="choosePostType" style={{display: 'none'}}>
          <button
            className="btn btn-primary newPostButton"
            id="newPostImageButton"
            onClick={this.togglePostType}
            >
            < FontAwesomeIcon icon={['far', 'image']} /> Image/Gif
          </button>
          <button
            className="btn btn-secondary newPostButton"
            id="newPostTextButton"
            onClick={this.togglePostType}
            >
            < FontAwesomeIcon icon={['fas', 'align-left']} /> Text
          </button>
          <button
            className="btn btn-secondary newPostButton"
            id="newPostVideoButton"
            onClick={this.togglePostType}
            >
            < FontAwesomeIcon icon={['fab', 'youtube']} /> YouTube Embed
          </button>
          {
          // <Link
          //   className="btn btn-secondary newPostButton"
          //   id="newPostArticleButton"
          //   to={"/CreateArticlePost"}
          // >
          //   < FontAwesomeIcon icon={['fas', 'file-alt']} /> Article
          // </Link>
          }
        </div>
        <br />
        <br />
        <div
          id="imageUploadForm"
          style={
            this.state.imagePost ?
            {display: 'inline'} : {display: 'none'}
          }>
          <form
            action={'/posts/'
                     + localStorage.getItem('plumUser56010')
                     + '/createImagePost'}
            method='post'
            encType="multipart/form-data">
            <h4>< FontAwesomeIcon icon={['far', 'image']} /> Image/Gif </h4>
            <br />
            <label htmlFor="fileUploadInput" className="btn btn-secondary" style={{width: '200px', margin: 'auto'}}>
              Click to upload image
            </label>
            <input
              name="postPic"
              id="fileUploadInput"
              type="file"
              onChange={this.handleChange}
              style={{marginLeft: '10px', display: 'none'}} />
            <br /><br />
            <input
              id="tokenInput"
              className="form-control"
              name="tokenInput"
              type="text"
              value={localStorage.getItem('token')}
              aria-label="TextPostTitle"
              readOnly
              style={{display: 'none'}}
            />
            <div id="fileSizeError" style={{color: 'red', display: 'none'}}>
              File size is too large. Files cannot exceed 10MB in size.
              <br /><br />
            </div>
            <div id="fileTypeError" style={{color: 'red', display: 'none'}}>
              File type not accepted. Only .PNG, .JPG/JPEG, .GIF file extensions allowed.
              <br /><br />
            </div>
            <img
              src={this.state.file}
              alt="post"
              style={ this.state.displayPreview ? {display: 'inline', maxWidth: '90%'} : {display: 'none'}}
            />
            <br /><br />
            <textarea
              className="form-control"
              name="postDescription"
              rows="3"
              style={{width: '80%', margin: 'auto'}}
              placeholder="Post description...">
            </textarea>
            <br />

            <label htmlFor="postIsNSFW">
              Required: Does this post contain adult content? (NSFW)
            </label><br />
            <input
              type="checkbox"
              id="postIsNSFW"
              name="nsfwPostCheckbox"
              value="postIsNSFW"
              onChange={this.nsfwCheckboxAction}
              checked={localStorage.getItem('autoCheckNsfwOnPosts') === 'true' ? true : false}/> Yes &nbsp;
            <input
              type="checkbox"
              id="postIsNotNSFW"
              name="nsfwPostCheckbox"
              value="postIsNotNSFW"
              onChange={this.nsfwCheckboxAction} /> No <br />
            You can read the guidelines for what classifies as adult/NSFW content <a href="/guidelines#nsfw">here.</a> <br />
            <button
              type="submit"
              className="btn btn-primary"
              id="formSubmitButton"
              disabled>
              Post
            </button>
          </form>
        </div>
        <div
          id="textUploadForm"
          style={
            this.state.textPost ?
            {display: 'inline'} : {display: 'none'}
          }>
          <h4>< FontAwesomeIcon icon={['fas', 'align-left']} /> Text </h4>
          <br />
          Title (max 120 chars)
          <input
            id="textPostTitle"
            className="form-control"
            type="text"
            placeholder="Post Title"
            aria-label="TextPostTitle"
            maxLength="120"
            style={{width: '80%', margin: 'auto', marginTop: '5px'}}
          />
          <div id="textPostTitleError" style={{display: 'none'}}>
            Your post must have a title.
          </div>
          <br />
          Content (optional, max 400 chars)
          <br />
          <textarea
            id="textPostContent"
            className="form-control"
            name="textPostContent"
            style={{
              width: '80%',
              height: '200px',
              margin: 'auto'
            }}
            maxLength="400"
            placeholder="Post text...">
          </textarea>
          <br />
          <button
            className="btn btn-primary"
            id="submitTextPost"
            style={{width: '220px'}}
            onClick={this.submitTextPost}>
            Post
          </button>
        </div>
        <div
          id="videoUploadForm"
          style={
            this.state.videoPost ?
            {display: 'inline'} : {display: 'none'}
          }>
          <h4>< FontAwesomeIcon icon={['fab', 'youtube']} /> YouTube Embed </h4>
          <br />
          Paste or enter URL of a YouTube video you want to share:
          <br /><br />
          <input
            id="videoPostURL"
            className="form-control"
            type="text"
            placeholder="https://www.youtube.com/watch?v=aC7eegwbDwE"
            aria-label="VideoPostURL"
            style={{width: '80%', margin: 'auto'}}
          />
          <div id="videoPostError" style={{display: 'none', color: 'red'}}>
            You must submit a valid link to a YouTube video.
          </div>
          <br /><br />
          <textarea
            name="videoPostDescription"
            id="videoPostDescription"
            className="form-control"
            style={{
              width: '80%',
              margin: 'auto',
              height: '100px'
            }}
            placeholder="Video description (optional)">
          </textarea>
          <br />
          <button
            className="btn btn-primary"
            id="submitVideoPost"
            style={{width: '220px'}}
            onClick={this.submitVideoPost}>
            Post
          </button>
        </div>

      </div>
    );
  }
}
export default CreatePost;
