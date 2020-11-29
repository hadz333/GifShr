import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DEFAULT_COVER_IMAGE = '/text_post.png'

class CreateArticlePost extends Component {

  constructor(props) {
    super(props)
    this.state = {
      paragraphCount: 0,
      imageEmbedCount: 0,
      youtubeEmbedCount: 0,
      phEmbedCount: 0,
      tweetEmbedCount: 0,
      instaEmbedCount: 0,
      coverImage: null,
    }
  }

  // try to submit this article
  submitArticlePost = async () => {
    // if title length < 1, return fail with title length

    // if neither nsfw checkbox is checked, return fail

    // required is done, continue with post attempt

    // in the request HTTP body, cover image will be the following:
    // this.state.coverImage || DEFAULT_COVER_IMAGE
  }

  // check whether or not the NSFW box should be checked to yes by default
  checkAutoNsfwCheck = () => {
    if (localStorage.getItem('autoCheckNsfwOnPosts') === 'true') {
      return true
    } else if (this.state.phEmbedCount > 0) {
      return true
    } else {
      return false
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
  }

  // delete one of the sections which have been added
  deleteSection = () => {

  }

  unveilConfirmationDialogue = () => {
    console.log('a')
  }

  // add a paragraph section to article
  addParagraphSection = () => {
    const addedSections = document.getElementById('addedSections')
    let newParagraphSection = document.createElement('div')
    newParagraphSection.id = 'paragraphSection' + this.state.paragraphCount
    newParagraphSection.style.marginBottom = '40px'
    newParagraphSection.style.border = '2px solid #b5b5b5'
    newParagraphSection.style.borderRadius = '12px'

    let newParagraphHeader = document.createElement('h5')
    newParagraphHeader.textContent = 'Paragraph Section ' + (this.state.paragraphCount + 1)
    newParagraphSection.appendChild(newParagraphHeader)

    let newParagraphTextarea = document.createElement("textarea")
    newParagraphTextarea.id = 'paragraphTextarea' + this.state.paragraphCount
    newParagraphTextarea.className = 'paragraphSection form-control'
    newParagraphTextarea.maxLength = 400
    newParagraphTextarea.placeholder = 'Paragraph text...'
    newParagraphTextarea.rows = 4
    newParagraphTextarea.style.marginTop = '10px'
    newParagraphTextarea.style.marginBottom = '10px'
    newParagraphSection.appendChild(newParagraphTextarea)

    let paragraphSectionDeleteButton = document.createElement('button')
    paragraphSectionDeleteButton.id = paragraphSectionDeleteButton + this.state.paragraphCount
    paragraphSectionDeleteButton.className = 'btn btn-danger'
    paragraphSectionDeleteButton.textContent = 'Remove Section'
    paragraphSectionDeleteButton.style.width = '50%'
    paragraphSectionDeleteButton.style.marginBottom = '10px'
    paragraphSectionDeleteButton.onClick = this.unveilConfirmationDialogue()
    newParagraphSection.appendChild(paragraphSectionDeleteButton)

    let confirmationDialogue = document.createElement('div')
    confirmationDialogue.id = 'confirmationDialogue' + this.state.paragraphCount
    confirmationDialogue.style.display = 'none'

    let confirmationQuestion = document.createElement('p')
    confirmationQuestion.id = 'confirmationQuestion' + this.state.paragraphCount
    confirmationQuestion.textContent = 'Are you sure you want to remove this section?'
    confirmationDialogue.appendChild(confirmationQuestion)

    let areYouSureDialogue = document.createElement('button')
    areYouSureDialogue.id = 'areYouSureDialogue' + this.state.paragraphCount
    areYouSureDialogue.className = 'btn btn-warning'
    areYouSureDialogue.textContent = 'Yes'
    areYouSureDialogue.style.width = '50%'
    areYouSureDialogue.style.marginBottom = '10px'

    confirmationDialogue.appendChild(areYouSureDialogue)

    newParagraphSection.appendChild(confirmationDialogue)

    addedSections.appendChild(newParagraphSection)
    this.setState({
      paragraphCount: this.state.paragraphCount + 1
    })
  }

  // add a paragraph section to article
  addImageEmbedSection = () => {
    console.log('here')
    const addedSections = document.getElementById('addedSections')
    let newImageEmbedSection = document.createElement("div")
    newImageEmbedSection.id = 'imageEmbedSection' + this.state.imageEmbedCount
    newImageEmbedSection.style.marginBottom = '40px'
    newImageEmbedSection.style.border = '2px solid #337ab7'
    newImageEmbedSection.style.borderRadius = '12px'

    let newImageEmbedHeader = document.createElement('h5')
    newImageEmbedHeader.textContent = 'Image Embed section ' + (this.state.imageEmbedCount + 1)
    newImageEmbedSection.appendChild(newImageEmbedHeader)

    let newImageEmbedDetails = document.createElement('p')
    newImageEmbedDetails.textContent = 'Enter the URL of an image below to embed it into your article.'
    newImageEmbedSection.appendChild(newImageEmbedDetails)

    // add file upload input
    let newFileUpload = document.createElement('input')
    newFileUpload.className = 'imageEmbedSection form-control'
    newFileUpload.id = 'imageURL' + this.state.imageEmbedCount
    newFileUpload.type = 'text'
    newFileUpload.style.width = '80%'
    newFileUpload.style.margin = 'auto'
    newFileUpload.style.marginTop = '10px'
    newFileUpload.style.marginBottom = '20px'
    newFileUpload.placeholder = 'Image URL'
    newImageEmbedSection.appendChild(newFileUpload)

    addedSections.appendChild(newImageEmbedSection)
    this.setState({
      imageEmbedCount: this.state.imageEmbedCount + 1
    })
  }

  render() {
    return (
      <div id="createArticlePost" style={{width: '95%', margin: 'auto', textAlign: 'center'}}>
        <h3>Article Creator</h3>
        <p>
          Use the tools below to add paragraphs, images/gifs, etc to the article.
        </p>
        <span style={{color: 'red'}}>
        Required: *
        </span>
        <br />

        <br />
        Title<span style={{color: 'red'}}>
        *
        </span>
        <br />
        <input
          type="text"
          className="form-control"
          id="articleTitle"
          maxLength="100"
          placeholder="Title of your article"
          style={{width: '90%', margin: 'auto'}} />
        <br />
        <br />
        <div id="addedSections">
        </div>
        <div id="addSection" style={{border: '1px solid black', borderRadius: '12px'}}>
          Add a section:
          <br />
          <button
            className="articleAddSectionButton btn btn-secondary"
            onClick={this.addParagraphSection}
          >
          Paragraph <br />
          <FontAwesomeIcon icon="paragraph" />
          </button>
          <button
            className="articleAddSectionButton btn btn-primary"
            onClick={this.addImageEmbedSection}
          >
          Image Embed <br />
          <FontAwesomeIcon icon={['far', 'image']} />
          </button>
          <button
            className="articleAddSectionButton btn btn-danger"
          >
          YouTube Embed <br />
          <FontAwesomeIcon icon={['fab', 'youtube']} />
          </button>
          <button
            className="articleAddSectionButton btn btn-warning"
            style={localStorage.getItem('showNsfw') === 'true' ?
            {display: 'inline'} :
            {display: 'none'}}
          >
          PH Embed <br />
          <FontAwesomeIcon icon={['fab', 'youtube']} />
          </button>
          <button
            className="articleAddSectionButton btn btn-primary"
            id="articleTweetEmbedButton"
            style={{background: '#00acee'}}
          >
          Tweet Embed <br />
          <FontAwesomeIcon icon={['fab', 'twitter']} />
          </button>
          <button
            className="articleAddSectionButton btn btn-primary"
            id="articleInstaEmbedButton"
            style={{background: '#515BD4'}}
          >
          Instagram Embed <br />
          <FontAwesomeIcon icon={['fab', 'instagram']} />
          </button>
        </div>
        <br />
        <label htmlFor="postIsNSFW">
          Does this post contain adult content? (NSFW)
          <span style={{color: 'red'}}>
          *
          </span>
        </label><br />
        <input
          type="checkbox"
          id="postIsNSFW"
          name="nsfwPostCheckbox"
          value="postIsNSFW"
          onChange={this.nsfwCheckboxAction}
          checked={this.checkAutoNsfwCheck() ? true : false}/> Yes &nbsp;
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
          onClick={this.submitArticlePost}>
          Post
        </button>

      </div>
    )
  }
}

export default CreateArticlePost;
