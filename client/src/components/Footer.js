import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class Footer extends Component {
  // When the user clicks on the button, scroll to the top of the document
  scrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  render() {
    return (
      <div id="footer">
        <span id="footerLogo">
          <img
            width="40"
            src={
              process.env.PUBLIC_URL + '/GifShrLogo.png'
            }
            alt="logo"
          />
        </span>
        &emsp;
        <span id="footerLinkColumn">
          <Link to="/about"
            style={localStorage.getItem('darkMode') === 'true' ? {color: 'white'}
              : {color: 'black'}}
            onClick={this.scrollToTop}>
            About
          </Link>
          &nbsp;|&nbsp;
          <Link to="/faq"
            style={localStorage.getItem('darkMode') === 'true' ? {color: 'white'}
              : {color: 'black'}}
            onClick={this.scrollToTop}>
            FAQ
          </Link>
          &nbsp;|&nbsp;
          <Link to="/support"
            style={localStorage.getItem('darkMode') === 'true' ? {color: 'white'}
              : {color: 'black'}}
            onClick={this.scrollToTop}>
            Support
          </Link>
        </span>
        <br />
        <div style={{textAlign: 'center'}}>
        GifShr &copy; 2020. All rights reserved.
        </div>
      </div>
    )
  }
}

export default Footer;
