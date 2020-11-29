import React, { Component } from 'react';

class Guidelines extends Component {
  render() {
    return (
      <div style={{marginLeft: '10%', marginRight: '10%'}}>
        <h2 style={{textAlign: 'center'}}>Guidelines</h2>
        <p>
          Although full freedom and autonomy is ideal, it's not possible on a social media platform due to toxic, immoral, or illegal behavior. Here are some guidelines for what kind of content will not be tolerated on this platform.<br /><br />
          The following kinds of content will result in your account being banned, with varying severity:
        </p>
        <ul>
          <li>Inappropriate content involving minor(s)</li>
          <li>Content containing abusive, harmful or illegal behavior</li>
          <li>Offensive language i.e. threats, obscene racism</li>
          <li>Inappropriate/sexual content (doesn't apply to NSFW posts - only applies on a post which wasn't indicated to be NSFW upon creation)</li>
          <li>Spam, scamming or phishing</li>
        </ul>
        <br />
        NSFW content contains one or more of the following, and is allowed as long as you mark your post as NSFW:
        <ul>
          <li>Nudity i.e. exposure of 'private parts' in image </li>
          <li>Sexually suggestive content </li>
          <li>Pornography</li>
        </ul>
      </div>
    )
  }
}

export default Guidelines;
