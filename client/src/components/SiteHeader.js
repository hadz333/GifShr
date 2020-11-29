// pick the correct header to render
import React, { Component } from 'react';
import LoggedInHeader from './LoggedInHeader'
import NotLoggedInHeader from './NotLoggedInHeader'

class SiteHeader extends Component {

  render() {
    const user = localStorage.getItem('plumUser56010')
    if (user) {
      return < LoggedInHeader />
    } else {
      return < NotLoggedInHeader />
    }
  }
}

export default SiteHeader;
