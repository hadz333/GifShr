import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saveButtonText: 'Save changes',
      statusText: '',
      darkMode: false,
      showNsfw: false,
      autoShowNsfw: false,
      autoCheckNsfwOnPosts: false,
    }
  }

  componentDidMount() {
    // check all variables
    if (localStorage.getItem('darkMode') === 'true') {
      this.setState({
        darkMode: true
      })
    }
    if (localStorage.getItem('showNsfw') === 'true') {
      this.setState({
        showNsfw: true
      })
    }
    if (localStorage.getItem('autoShowNsfw') === 'true') {
      this.setState({
        autoShowNsfw: true
      })
    }
    if (localStorage.getItem('autoCheckNsfwOnPosts') === 'true') {
      this.setState({
        autoCheckNsfwOnPosts: true
      })
    }
  }

  // handle a setting toggle
  handleSettingToggle = (e) => {
    const body = document.getElementsByTagName("BODY")[0];
    const checked = e.target.checked
    // e.target.name will tell you which switch was toggled
    switch(e.target.name) {
      case 'darkModeSwitch':
        if (checked) {
          this.setState({
            darkMode: true,
            statusText: ''
          })
          // initiate dark mode
          body.style.color = '#b5b5b5'
          body.style.backgroundColor = '#423f3f'
        } else {
          this.setState({
            darkMode: false,
            statusText: ''
          })
          body.style.color = 'black'
          body.style.backgroundColor = '#fafdff'
        }
        break;
      case 'showNsfwSwitch':
        if (checked) {
          this.setState({
            showNsfw: true,
            statusText: ''
          })
        } else {
          this.setState({
            showNsfw: false,
            autoShowNsfw: false, // must be unset if show is unset
            statusText: ''
          })
        }
        break;
      case 'autoShowNsfwSwitch':
        if (checked) {
          this.setState({
            autoShowNsfw: true,
            showNsfw: true, // must be set if auto-show is set
            statusText: ''
          })
        } else {
          this.setState({
            autoShowNsfw: false,
            statusText: ''
          })
        }
        break;
      case 'autoCheckNsfwOnPosts':
        if (checked) {
          this.setState({
            autoCheckNsfwOnPosts: true,
            statusText: ''
          })
        } else {
          this.setState({
            autoCheckNsfwOnPosts: false,
            statusText: ''
          })
        }
        break;
      default:
        break;
    }
  }

  // save changes
  saveChanges = async () => {
    this.setState({
      saveButtonText: 'Saving...',
      statusText: ''
    })
    // set local storage variables
    localStorage.setItem('darkMode', this.state.darkMode)
    localStorage.setItem('showNsfw', this.state.showNsfw)
    localStorage.setItem('autoShowNsfw', this.state.autoShowNsfw)
    localStorage.setItem('autoCheckNsfwOnPosts',
                          this.state.autoCheckNsfwOnPosts)
    // store preferences in database
    const response = await fetch('/profile/updatePreferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: localStorage.getItem('plumUser56010'),
        darkMode: this.state.darkMode,
        showNsfw: this.state.showNsfw,
        autoShowNsfw: this.state.autoShowNsfw,
        autoCheckNsfwOnPosts: this.state.autoCheckNsfwOnPosts,
        token: localStorage.getItem('token')
      })
    })
    const body = await response.text()
    if (body === 'success') {
      this.setState({
        saveButtonText: 'Save changes',
        statusText: 'Changes saved.'
      })
    } else {
      this.setState({
        saveButtonText: 'Save changes',
        statusText: 'Failed to save changes.'
      })
    }
  }

  render() {
    return (
      <div
        style={{marginLeft: '5%'}}>

        <h2>Settings</h2>
        <div
          id="settingsMenu"
          style={{paddingTop: '20px'}}>
          <label className="switch">
            <input
              name="darkModeSwitch"
              type="checkbox"
              checked={this.state.darkMode}
              onChange={(event) => this.handleSettingToggle(event)}
            />
            <span className="slider round"></span>
          </label> &nbsp;
          Night Mode
          <br />
          <br />
          NSFW Settings
          <br />
          By enabling NSFW content, you agree that you are at least 18 years of age.
          <br /><br />

          <label className="switch">
            <input
              name="showNsfwSwitch"
              type="checkbox"
              checked={this.state.showNsfw}
              onChange={(event) => this.handleSettingToggle(event)}
            />
            <span className="slider round"></span>
          </label> &nbsp;
          Enable NSFW posts
          <br />
          <label className="switch">
            <input
              name="autoShowNsfwSwitch"
              type="checkbox"
              checked={this.state.autoShowNsfw}
              onChange={(event) => this.handleSettingToggle(event)}
            />
            <span className="slider round"></span>
          </label> &nbsp;
          Auto-show NSFW posts
          <br />

          <label className="switch">
            <input
              name="autoCheckNsfwOnPosts"
              type="checkbox"
              checked={this.state.autoCheckNsfwOnPosts}
              onChange={(event) => this.handleSettingToggle(event)}
            />
            <span className="slider round"></span>
          </label> &nbsp;
          Mark my posts NSFW by default
          <br />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.saveChanges}
          style={{width: '200px'}}>
          {this.state.saveButtonText}
        </button>
        <br /> {this.state.statusText}
      </div>
    )
  }
}
export default Settings;
