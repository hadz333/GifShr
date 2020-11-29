import React, { Component } from 'react';

class Faq extends Component {
  render() {
    return (
      <div style={{marginLeft: '10%', marginRight: '10%'}}>
        <h2 style={{textAlign: 'center'}}>Frequently Asked Questions</h2>
        <br /><br />
        <h4>Are there any rules for what I can post?</h4>
        <p>
          Posts and comments must follow the rules listed on the <a href="/guidelines">guidelines page.</a>
        </p>
        <br />
        <h4>Will there be a mobile app released for Android and iOS?</h4>
        <p>
          As of now, no. Currently, policies for uploading an app to the Google Play store and iOS Store do not allow for NSFW content.
          However, we are actively looking into this matter and may launch mobile apps in the future.
        </p>
        <br />
        <h4>Will I be able to monetize my posts (get paid a portion of ad revenue)?</h4>
        <p>
        While there are currently ads on the site, running this platform costs money and that price only goes up with more users.
        We are crunching the numbers and going to figure out how to move forward with providing monetization for users without losing money as a business.
        Our goal is to have at least 50% of ad revenue go to users. Stay tuned for more information in the future.
        </p>
        <br />
        <h4>Can I report people who break rules?</h4>
        <p>
          Yes, you can report a post, comment, or a profile which is breaking one of the rules listed on our <a href="/guidelines">guidelines.</a> All reports are
           reviewed by a human.
        </p>
        <br />
        <h4>What is the punishment for breaking the rules?</h4>
        <p>
          Users who break a rule will receive a ban and have the offending post or comment removed. Ban durations vary based on the severity of the rule(s) broken.
        </p>
        <br />
        <h4>How do I get to the Settings page?</h4>
        <p>
          You can view your Settings page by clicking on the menu (the 3 horizontal lines) in the top right and then clicking Settings in the menu that pops up.
        </p>
        <br />
        <h4>How can I view NSFW posts?</h4>
        <p>
          First, you must be signed in. Then, on the <a href='/settings'>Settings page</a>, enable the "Show NSFW posts" switch. If you want to automatically see posts without clicking them, as well as see NSFW posts
          in Post Grids, enable the "Auto-show NSFW posts" option. Remember to click 'Save changes' at the bottom before navigating away from Settings.
        </p>
        <br />
        <h4>How can I view NSFW posts automatically without clicking?</h4>
        <p>
          While being signed in, go to the <a href='/settings'>Settings page</a>, enable the "Auto-show NSFW posts" option. Remember to click 'Save changes' at the bottom before navigating away from Settings.
        </p>
        <br />
        <h4>NSFW posts are not appearing in the post grid. How do I make NSFW posts appear in post grid(s)?</h4>
        <p>
          While being signed in, on the <a href='/settings'>Settings page</a>, enable the "Auto-show NSFW posts" option. Remember to click 'Save changes' at the bottom before navigating away from Settings.
          This is the only way to get NSFW posts to show up on Post Grid views.
        </p>
        <br />
        <h4>What is considered to be, or classifies as NSFW content?</h4>
        <p>
          NSFW content contains one or more of the following:
        </p>
        <ul>
          <li>Nudity i.e. exposure of 'private parts' in image </li>
          <li>Sexually suggestive content </li>
          <li>Pornography</li>
        </ul>
        <br />
        <h4>Is there a dark / night mode for the site?</h4>
        <p>
          Yes, visit the <a href="/settings">Settings page</a> and enable the "Night Mode" option. Remember to click Save changes.
        </p>
        <br />
        <h4>Where are text posts in the post grid?</h4>
        <p>
          It was a design decision to not put text posts in the Post Grid view, as there was no good looking way to implement them.
        </p>
        <br />
        <h4>How can I post NSFW content?</h4>
        <p>
          To post an NSFW image or gif, you must select the 'yes' checkbox when asked if your post is NSFW on the creation page.
        </p>
        <br />
        <h4>What is Post Grid?</h4>
        <p>
          Post Grid is a setting which determines the layout of posts you see on a profile, or on your 'liked posts' page.
          Activating Post Grid will put images in a 3-image-wide grid; each image contains a link to their respective post when clicked.
          Deactivating Post Grid will set these posts to be in a 'timeline' kind of view, with all info for each post displayed.
        </p>
        <br />
        <h4>What if someone is posting content that belongs to me (copyright infringement), or impersonating me?</h4>
        <p>
          Contact support at copyright@gifshr.com with the content being stolen and we will get back to you to resolve the issue.

        </p>
        <br />
      </div>
    )
  }
}

export default Faq;
