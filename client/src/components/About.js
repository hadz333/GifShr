import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div style={{marginLeft: '10%', marginRight: '10%'}}>
        <h2 style={{textAlign: 'center'}}>About GifShr</h2>
        <p>
          &emsp; GifShr (pronounced Gif-Share) is currently a web-browser only social media platform which allows users to post, like, share, and comment on various forms of content.
          We offer a human team dedicated to preventing spam, toxicity, and unlawful activity from existing on the platform.
          <br /><br />
          &emsp; GifSh(a)r(e) sprouted from the idea that social media users should be able to monetize their content directly through the app, rather than having to go through sponsors.
          This has transformed into more than just monetization, as we also want to provide an app that prioritizes free speech and doesn't collect user's personal data.
          In the near future, we hope to achieve our goal of providing users with a way to earn ad revenue from their pages.
        </p>
        <br /><br />
        <h2 style={{textAlign: 'center'}}>Mission Statement:</h2>
        <p>
          &emsp; This platform was created with three main goals at the forefront.
          <br /><br />
          &emsp; First, we want privacy for users. This starts with no phone number to sign up, and goes beyond.
          Our platform promises not to sell, share or use any of your information, photos, or posts in any manner whatsoever aside from
          what you see on this platform.
        </p>
        <p>
          &emsp; Second, we want a platform with freedom of speech at the forefront. This means no stifling algorithms to hide posts which
          deserve attention, no shadow banning, no quarantining of posts/users.
          This doesn't mean an absolute free-for-all, as anything posted must still abide by the <a href="/guidelines">guidelines.</a>
        </p>
        <p>
          &emsp; Third, we want to provide content creators with another form of monetization.
          A lot of social media sites have advertisements, with corporations taking all of the revenue from the ads.
          These corporations give none of this revenue to the users' whose content is what brings people to the platform in the first place.
          While there are currently no ads on the site, running this platform costs money and that price only goes up with more users.
          In the future, we are going to crunch the numbers and figure out how to move forward with providing monetization
          for users without losing money as a business.
          Our goal is to have at least 50% of ad revenue go to users. Stay tuned for more information in the future.
        </p>
        <p>
          Thank You for either joining or considering joining GifShr,
          <br /><br />
          The GifShr Team
        </p>
      </div>
    )
  }
}

export default About;
