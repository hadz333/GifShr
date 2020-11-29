import React, { Component } from 'react';

// list of rules that can be in reports
const RULES = [
  'Inappropriate content involving minor(s)',
  'Content containing abusive, harmful or illegal behavior',
  'Offensive language i.e. threats, obscene racism',
  'Inappropriate/sexual content (missing NSFW tag)',
  'Spam, scamming or phishing'
]

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reports: []
    }
  }

  componentDidMount() {
    this.renderReports()
  }

  // render reports (will only render for admins)
  renderReports = async () => {
    const user = localStorage.getItem('plumUser56010')
    const response = await fetch('/admin/a8b010/' + user)
    const body = await response.text()
    if (body !== 'You are not an admin.') {
      const parsedBody = await JSON.parse(body)
      this.setState({
        reports: parsedBody
      })
    }
  }

  // retrieve the post or comment which is under scrutiny
  retrievePostOrCommentInQuestion = async (e) => {
    const reportsIndex = parseInt(e.target.id.split('viewPostButton')[1])
    const reportClicked = this.state.reports[reportsIndex]
    if (reportClicked.postId) {
      // retrieve post from API
      const response = await fetch('/posts/retrievePostById/'
        + reportClicked.postId)
      const body = await response.text()
      const parsedBody = await JSON.parse(body)
      this.setState({
        parsedBody: parsedBody
      })
      // set div to contain this post
      const viewPost = document.getElementById('viewPost' + reportsIndex)
      viewPost.style.display = 'inline'
      const postLink = parsedBody.postId
      viewPost.innerHTML = '&emsp;<a href="/profile/' + parsedBody.profile + '/' + postLink + '" target="_blank">Link to Post</a>'
    } else if (reportClicked.commentId) {
      // retrieve this specific comment from API

      const response = await fetch('/comments/retrieveCommentById/'
        + reportClicked.commentId)
      const body = await response.text()
      const parsedBody = await JSON.parse(body)
      this.setState({
        parsedBody: parsedBody
      })

      // set div to contain this comment
      const viewComment = document.getElementById('viewComment' + reportsIndex)
      viewComment.innerHTML = '<br />comment text below: <br />' + parsedBody.content
    }

  }

  // deliver a guilty verdict on a post
  guiltyVerdict = async (e) => {
    const reportId = e.target.id.split('guiltyButton')[1]

    const verdictRule1 = document.getElementById('verdictRule1' + reportId)
    const verdictRule2 = document.getElementById('verdictRule2' + reportId)
    const verdictRule3 = document.getElementById('verdictRule3' + reportId)
    const verdictRule4 = document.getElementById('verdictRule4' + reportId)
    const verdictRule5 = document.getElementById('verdictRule5' + reportId)

    // deliver guilty verdict to API
    // if at least 1 broken rule checked
    if (verdictRule1.checked ||
        verdictRule2.checked ||
        verdictRule3.checked ||
        verdictRule4.checked ||
        verdictRule5.checked) {

      // disable buttons on this report
      const innocentButton = document.getElementById('innocentButton' + reportId)
      const guiltyButton = e.target
      innocentButton.disabled = true
      guiltyButton.disabled = true

      await fetch('/report/guiltyVerdict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reportId: reportId,
          rule1Broken: verdictRule1.checked,
          rule2Broken: verdictRule2.checked,
          rule3Broken: verdictRule3.checked,
          rule4Broken: verdictRule4.checked,
          rule5Broken: verdictRule5.checked,
        })
      })


    } else {
      alert("You must select at least 1 rule the user is guilty of")
    }

  }

  // deliver an innocent verdict on a post
  innocentVerdict = async (e) => {
    const reportId = e.target.id.split('innocentButton')[1]

    // disable buttons on this report
    const innocentButton = e.target
    const guiltyButton = document.getElementById('guiltyButton' + reportId)
    innocentButton.disabled = true
    guiltyButton.disabled = true

    // deliver innocent verdict to API
    await fetch('/report/innocentVerdict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportId: reportId
      })
    })

  }

  render() {
    if (this.state.reports) {
      return (
        <div style={{marginLeft: '10%'}}>
          {this.state.reports.map((report, i) => (
            <div key={i} style={{marginBottom: '60px'}}>
              Defendant: <a href={'/profile/' + report.defendant} target="_blank" rel="noopener noreferrer">{report.defendant}</a> <br />
              Rules broken:
              {report.rulesReported.map((ruleReported, j) => (
                  <ul key={j}>
                  <div key={j}>
                    <li>{RULES[ruleReported - 1]}</li>
                  </div>
                  </ul>
              ))}
              <br />
              <button
                id={'viewPostButton' + i}
                onClick={this.retrievePostOrCommentInQuestion}
                style={!report.postId && !report.commentId ? {display: 'none'} : {display: 'inline'}}
              >
              View post or comment
              </button>
              <div id={"viewPost" + i} style={{display: 'hidden'}}>
              </div>
              <div id={"viewComment" + i}>
              </div>
              <br />
              If Guilty, which rules were indeed broken?
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id={"verdictRule1" + report._id} />
                <label className="form-check-label" htmlFor={"verdictRule1" + report._id} style={{marginTop: '4px'}}>
                  Inappropriate content involving minor(s)
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id={"verdictRule2" + report._id} />
                <label className="form-check-label" htmlFor={"verdictRule2" + report._id} style={{marginTop: '4px'}}>
                  Content containing abusive, harmful or illegal behavior
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id={"verdictRule3" + report._id} />
                <label className="form-check-label" htmlFor={"verdictRule3" + report._id} style={{marginTop: '4px'}}>
                  Offensive language i.e. threats, obscene racism
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id={"verdictRule4" + report._id} />
                <label className="form-check-label" htmlFor={"verdictRule4" + report._id} style={{marginTop: '4px'}}>
                  Inappropriate/sexual content (missing NSFW tag)
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id={"verdictRule5" + report._id} />
                <label className="form-check-label" htmlFor={"verdictRule5" + report._id} style={{marginTop: '4px'}}>
                  Spam, scamming or phishing
                </label>
              </div>
              <br />
              <button
                type="button"
                className="btn btn-danger"
                id={"guiltyButton" + report._id}
                onClick={this.guiltyVerdict}
                style={{width: '10%', margin: '5px'}}
              >
                Guilty
              </button>
              <button
                type="button"
                className="btn btn-success"
                id={"innocentButton" + report._id}
                onClick={this.innocentVerdict}
                style={{width: '10%', margin: '5px'}}
              >
                Innocent
              </button>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div>
        Loading reports...
      </div>
    )
  }
}

export default Admin;
