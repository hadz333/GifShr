import React, { Component } from 'react';

class ReportForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      submitted: false,
      reportFailed: false,
    }
  }

  // make sure if profile is changed after a report is submitted,
  // post in this location does not have submitted message
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.id !== prevProps.id) {
      this.setState({
        submitted: false,
        reportFailed: false
      })
    }
  }

  // function to handle report
  handleReport = async () => {
    const reportErrorMessage = document.getElementById("reportError" + this.props.id)
    if (!localStorage.getItem('plumUser56010')) {
      if (!this.props.isPost) {
        alert("You must be signed in to perform this action.")
      } else {
        const mustBeSignedIn = document.getElementById("mustBeSignedIn")
        mustBeSignedIn.style.display = 'inline'
        alert("You must be signed in to perform this action.")
      }
      return
    }
    if (this.props.isPost) {
      // post report handler
      if (this.props.nsfw) {
        // nsfw post
        // get all rule checkboxes
        // this post type contains rules 1, 2, and 5
        const reportRule1 = document.getElementById("reportRule1" + this.props.id)
        const reportRule2 = document.getElementById("reportRule2" + this.props.id)
        const reportRule5 = document.getElementById("reportRule5" + this.props.id)
        // store the rule numbers broken in array
        let rulesReported = []
        if (reportRule1.checked) {
          rulesReported.push(1)
        }
        if (reportRule2.checked) {
          rulesReported.push(2)
        }
        if (reportRule5.checked) {
          rulesReported.push(5)
        }

        if (rulesReported.length > 0) {
          // if rulesReported contains some, push the report.
          // post info to API
          const response = await fetch('/report/submitReport', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              defendant: this.props.profile,
              postId: this.props.id,
              reportDate: new Date(),
              rulesReported: rulesReported,
              reportedBy: localStorage.getItem('plumUser56010')
            })
          })
          const body = await response.text()
          if (body === 'success') {
            this.setState({
              submitted: true
            })
          } else {
            this.setState({
              reportFailed: true
            })
          }
          reportErrorMessage.style.display = 'none'
        } else {
          // if none selected, display error message.
          reportErrorMessage.style.display = 'inline'
        }
      } else {
        // regular (non-nsfw post)
        // this post type contains rules 1, 2, 3, 4, 5
        const reportRule1 = document.getElementById("reportRule1" + this.props.id)
        const reportRule2 = document.getElementById("reportRule2" + this.props.id)
        const reportRule3 = document.getElementById("reportRule3" + this.props.id)
        const reportRule4 = document.getElementById("reportRule4" + this.props.id)
        const reportRule5 = document.getElementById("reportRule5" + this.props.id)

        let rulesReported = []
        if (reportRule1.checked) {
          rulesReported.push(1)
        }
        if (reportRule2.checked) {
          rulesReported.push(2)
        }
        if (reportRule3.checked) {
          rulesReported.push(3)
        }
        if (reportRule4.checked) {
          rulesReported.push(4)
        }
        if (reportRule5.checked) {
          rulesReported.push(5)
        }

        if (rulesReported.length > 0) {
          // if rulesReported contains some, push the report.
          // post info to API
          const response = await fetch('/report/submitReport', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              defendant: this.props.profile,
              postId: this.props.id,
              reportDate: new Date(),
              rulesReported: rulesReported,
              reportedBy: localStorage.getItem('plumUser56010')
            })
          })
          const body = await response.text()
          if (body === 'success') {
            this.setState({
              submitted: true
            })
          } else {
            this.setState({
              reportFailed: true
            })
          }
          reportErrorMessage.style.display = 'none'
        } else {
          // if none selected, display error message.
          reportErrorMessage.style.display = 'inline'
        }
      }
    } else {
      // comment report handler
      // comment contains rules 1, 2, 3, 5
      const reportRule1 = document.getElementById("reportRule1" + this.props.id)
      const reportRule2 = document.getElementById("reportRule2" + this.props.id)
      const reportRule3 = document.getElementById("reportRule3" + this.props.id)
      const reportRule5 = document.getElementById("reportRule5" + this.props.id)

      let rulesReported = []
      if (reportRule1.checked) {
        rulesReported.push(1)
      }
      if (reportRule2.checked) {
        rulesReported.push(2)
      }
      if (reportRule3.checked) {
        rulesReported.push(3)
      }
      if (reportRule5.checked) {
        rulesReported.push(5)
      }

      if (rulesReported.length > 0) {
        // if rulesReported contains some, push the report.
        // post info to API
        const response = await fetch('/report/submitReport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            defendant: this.props.profile,
            commentId: this.props.id,
            reportDate: new Date(),
            rulesReported: rulesReported,
            reportedBy: localStorage.getItem('plumUser56010')
          })
        })
        const body = await response.text()
        if (body === 'success') {
          this.setState({
            submitted: true
          })
        } else {
          this.setState({
            reportFailed: true
          })
        }
        reportErrorMessage.style.display = 'none'
      } else {
        // if none selected, display error message.
        reportErrorMessage.style.display = 'inline'
      }
    }

  }

  render() {
    if (this.state.submitted) {
      return (
        <div>
          Every report is reviewed by a human, we take your report seriously. Thank You!
        </div>
      )
    }

    if (this.state.reportFailed) {
      return (
        <div>
          Report failed. Please try again later.
        </div>
      )
    }
    if (this.props.isPost && !this.props.nsfw) {
      return (
        // normal post
        <div>
          Which rules has this post broken?
          <br />
          Select all that apply:
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule1" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule1" + this.props.id}>
              Inappropriate content involving minor(s)
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule2" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule2" + this.props.id}>
              Content containing abusive, harmful or illegal behavior
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule3" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule3" + this.props.id}>
              Offensive language i.e. threats, obscene racism
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule4" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule4" + this.props.id}>
              Inappropriate/sexual content (missing NSFW tag)
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule5" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule5" + this.props.id}>
              Spam, scamming or phishing
            </label>
          </div>
          <div id={"reportError" + this.props.id} style={{color: 'red', display: 'none'}}>
            You must select at least one rule to report. <br />
          </div>
          <button
            type="button"
            className="btn btn-secondary reportButton"
            onClick={this.handleReport}
          >
            Report
          </button>
          <div id="mustBeSignedIn" style={{display: 'none'}}>
            <br />
            You must be signed in to perform this action. &nbsp;
            <a href="/login">Sign in here.</a>
          </div>
        </div>
      )
    } else if (this.props.isPost && this.props.nsfw) {
      // nsfw post
      return (
        <div>
          Which rules has this post broken?
          <br />
          Select all that apply:
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule1" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule1" + this.props.id}>
              Inappropriate content involving minor(s)
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule2" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule2" + this.props.id}>
              Content containing abusive, harmful or illegal behavior
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule5" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule5" + this.props.id}>
              Spam, scamming or phishing
            </label>
          </div>
          <div id={"reportError" + this.props.id} style={{color: 'red', display: 'none'}}>
            You must select at least one rule to report. <br />
          </div>
          <button
            type="button"
            className="btn btn-secondary reportButton"
            onClick={this.handleReport}
          >
            Report
          </button>
          <div id="mustBeSignedIn" style={{display: 'none'}}>
            <br />
            You must be signed in to perform this action. &nbsp;
            <a href="/login">Sign in here.</a>
          </div>
        </div>
      )
    } else {
      // comment report
      return (
        <div>
          Which rules has this comment broken?
          <br />
          Select all that apply:
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule1" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule1" + this.props.id}>
              Inappropriate content involving minor(s)
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule2" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule2" + this.props.id}>
              Content containing abusive, harmful or illegal behavior
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule3" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule3" + this.props.id}>
              Offensive language i.e. threats, obscene racism
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={"reportRule5" + this.props.id} />
            <label className="form-check-label" htmlFor={"reportRule5" + this.props.id}>
              Spam, scamming or phishing
            </label>
          </div>
          <div id={"reportError" + this.props.id} style={{color: 'red', display: 'none'}}>
            You must select at least one rule to report. <br />
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary reportButton"
            onClick={this.handleReport}
          >
            Report
          </button>
        </div>
      )
    }
  }
}

export default ReportForm;
