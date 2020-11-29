import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class UpcomingFeaturePlug extends Component {
  render() {
    return (
      <div style={{width: '80%', margin: 'auto'}}>
        <br />
        <h1>Why GifShr?</h1>
        <br />
        <h3>Privacy</h3>
        <p className="plugParagraph">
          No phone number is required to sign up.
          In addition, our platform promises not to sell, share or use any of your information, including email, photos, or posts in any manner whatsoever aside from
          what you see on this platform.
        </p>
        <br />
        <h3>Anti-censorship</h3>
        <p className="plugParagraph">
        This is a platform with freedom of speech at the forefront. This means no stifling algorithms to hide posts which
        deserve attention, no shadow banning, no quarantining of posts/users.
        This doesn't mean an absolute free-for-all, as anything posted must still abide by the <a href="/guidelines">guidelines.</a>
        </p>
        <br />
        <h4>Upcoming feature: Monetize your content</h4>
        <FontAwesomeIcon
          icon={['fas', 'dollar-sign']}
          style={
            {color: 'green', fontSize: '60px'}
          }
        />
        <p className="plugParagraph">
        In the future, we will be adding advertisements and monetization to the site.
        This means that you will be able to get a significant portion of ad revenue
        on your profile and posts, with the rest being used to keep the platform running.
        </p>

      </div>
    )
  }
}

export default UpcomingFeaturePlug;
