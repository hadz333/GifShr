import React, { Component } from 'react';
import '../App.css';
import '../styles/loginPage.css';
import '../styles/accountCreation.css';
import { Container, Row, Col } from 'react-bootstrap';

const MAX_FILE_SIZE = 10000000 // 10 MB

class EditProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      file: null,
      displayPreview: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.enableButtonCheck = this.enableButtonCheck.bind(this)
  }

  enableButton = () => {
    document.getElementById("formSubmitButton").disabled = false
  }

  // check whether or not to enable submit button
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

  handleChange(event) {
    try {

      const fileUploadInput = document.getElementById('fileUploadInput')
      //console.log(fileUploadInput.files.item(0).type)

      // size validation
      const fileUploadSize = fileUploadInput.files.item(0).size
      if (fileUploadSize > MAX_FILE_SIZE) {
        // display size error
        this.setState({
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
          displayPreview: true,
          file: URL.createObjectURL(event.target.files[0])
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
      //console.log(err)
      this.setState({
        file: null
      })
      document.getElementById("formSubmitButton").disabled = true;
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

  render() {
    const description = this.props.description

    // render textbox for description
    // Edit profile image
    return (

      <div className="App" id="profileEditor">
        <Container>
          <Row>
            <Col>
              <h4>Edit profile</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              Upload new profile picture
            </Col>
          </Row>
          <Row>
            <Col>
              <form
                action={'/profile/'
                         + localStorage.getItem('plumUser56010')
                         + '/uploadProfileImage'}
                method='post'
                encType="multipart/form-data">
                <br />
                  <input
                    name="profilePic"
                    id="fileUploadInput"
                    type="file"
                    onChange={this.handleChange}
                    style={{marginLeft: '10px'}}
                  />
                  <br /><br />
                  <input
                    id="tokenInput"
                    className="form-control"
                    name="tokenInput"
                    type="text"
                    value={localStorage.getItem('token')}
                    aria-label="TextPostTitle"
                    width="2px"
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
                    id="profilePicture"
                    alt="profile"
                    style={this.state.displayPreview ? {display: 'inline'} : {display: 'none'}}
                  />
                  <br /><br />
                  Profile description
                  <br />
                  <textarea
                    name="profileDescription"
                    id="profileDescription"
                    rows="4"
                    cols="30"
                    defaultValue={description}
                    onChange={this.enableButton} >
                  </textarea>
                  <br />

                  <label htmlFor="postIsNSFW">
                    Required: Does this profile picture contain adult content? (NSFW)
                  </label><br />
                  <input
                    type="checkbox"
                    id="postIsNSFW"
                    name="nsfwPostCheckbox"
                    value="postIsNSFW"
                    onChange={this.nsfwCheckboxAction}/> Yes &nbsp;
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
                    Save
                  </button>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default EditProfile;
