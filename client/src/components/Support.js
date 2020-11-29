import React, { Component } from 'react';

class Support extends Component {
  render() {
    return (
      <div>
        <h2 style={{textAlign: 'center'}}>Support</h2>
        <p style={{width: '80%', margin: 'auto'}}>
          If you have any questions, concerns, feedback, suggestions,
          or you would like to report a problem, please contact us at: &nbsp;
          <a
            href="mailto:ajaxclounst@gmail.com"
            style={localStorage.getItem('darkMode') === 'true' ?
            {color: 'white'} : {}}>

            ajaxclounst@gmail.com
        </a>
        </p>
      </div>
    )
  }
}

export default Support;
