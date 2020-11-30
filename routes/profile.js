const express = require('express')
const router = express.Router()
const Profile = require('../model/profile')
const Post = require('../model/post')
const Ban = require('../model/ban')
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path')

// accepted file types: jpg, png, gif
const ACCEPTED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/gif']

// max search results per load
const MAX_SEARCH_RESULTS = 10

// list of rules that can be in reports
const RULES = [
  'Inappropriate content involving minor(s)',
  'Content containing abusive, harmful or illegal behavior',
  'Offensive language i.e. threats, obscene racism',
  'Inappropriate/sexual content (missing NSFW tag)',
  'Spam, scamming or phishing'
]

// this will create directory for new user which
// contains their images used for profile
const createDir = (dirPath) => {
  fs.mkdirSync(process.cwd() + dirPath, {recursive: true}, (error) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Your directory is made')
    }
  })
}

// update profile preferences
router.post('/updatePreferences', async (req, res) => {

  if (!req.body.username) {
    return res.send("error")
  }

  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.username })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  // find user
  const findQuery = { username: req.body.username }
  // update preference values
  const updateQuery = {
    darkMode: req.body.darkMode,
    showNsfw: req.body.showNsfw,
    autoShowNsfw: req.body.autoShowNsfw,
    autoCheckNsfwOnPosts: req.body.autoCheckNsfwOnPosts
  }

  await Profile.updateOne(findQuery, updateQuery)
    .catch(err => console.error(err))
  res.send("success")
})

// get profile preferences
router.get('/getPreferences/:username', async (req, res) => {
  // find user, return preferences
  const profile = await Profile.findOne({ username: req.params.username })
  res.json({
    darkMode: profile.darkMode,
    showNsfw: profile.showNsfw,
    autoShowNsfw: profile.autoShowNsfw,
    autoCheckNsfwOnPosts: profile.autoCheckNsfwOnPosts
  })
})

// Create profile route
router.post('/create', async (req, res) => {
  const profile = new Profile({
    username: req.body.username.toLowerCase(),
    password: req.body.password,
    email: req.body.email,
    creationDate: new Date(),
    profileImage: '/default_profile_image.png'
  })

  // server-side validation
  try {
    // check if user is attempting to do +(int) with existing email
    const emailBeforePlus = await req.body.email.split('+')[0]
    let emailToCheck = req.body.email
    if (emailBeforePlus !== req.body.email) {
      // if here, that means the email contains a +
      // remove the + to check for the real email
      const emailDomain = await req.body.email.split('@')[1]
      emailToCheck = emailBeforePlus + '@' + emailDomain
    }

    const profileTest = await Profile.find({ username: profile.username }).exec()
    const emailTest = await Profile.find({ email: emailToCheck }).exec()
    if (profileTest.length > 0) {
      res.send("Username already exists")
    } else if (emailTest.length > 0) {
      res.send("An account with this email already exists")
    } else {
      const newProfile = await profile.save()
      // create directory for user's pictures
      createDir('/client/public/' + req.body.username)
      createDir('/client/public/' + req.body.username + '/profileImages')
      res.send("success, " + newProfile._id)
    }
  } catch(err) {
    console.error(err)
  }
})

// login attempt route
router.post('/login', async (req, res) => {
  // username is case insensitive
  const username = await req.body.username.toLowerCase()
  const password = req.body.password


  try {
    const profile = (username.includes('@')) ? await Profile.findOne({ email: username }).exec() :
      await Profile.findOne({ username: username }).exec()

    if (profile) {
      if (profile.password === password) {
        // username matches password
        // query the ban table to check for ban
        const banCheck = await Ban.findOne({ profile: profile.username })
        // if in ban table, check date
        if (banCheck) {
          // get how many days since the ban verdict was handed down
          const MS_IN_DAY = 86400000
          const daysSinceBan = (new Date() - banCheck.timeOfBan) / MS_IN_DAY
          // if greater than ban duration, delete the ban and allow sign-in
          if (daysSinceBan >= banCheck.banDuration) {
            // delete the ban
            await Ban.deleteMany({ profile: profile.username })

            // allow sign-in
            res.send(
              "success, profileImage: " + profile.profileImage +
              ", token - " + profile._id + " username? " + profile.username
            )
          } else {
            // ban is still being served
            // return the proper message
            let banMessage = "One of your posts or comments has broken the following rules: ["
            for (i in banCheck.rulesBrokenOnCurrentBan) {
              banMessage += RULES[banCheck.rulesBrokenOnCurrentBan[i] - 1]
              if (i != banCheck.rulesBrokenOnCurrentBan.length - 1) {
                banMessage += ", "
              }
            }
            banMessage += "]. As a result, your account has been temporarily banned. " +
            "You have " + Math.ceil(banCheck.banDuration - daysSinceBan)
             + " days remaining on your ban."

            res.send(banMessage)
          }
        } else {
          res.send(
            "success, profileImage: " + profile.profileImage +
            ", token - " + profile._id + " username? " + profile.username
          )
        }
        // if ban is still valid, res.send the ban info
        // if ban time has been served, delete ban from table

      } else {
        // check for too many failed login attempts
        if (profile.lastLoginAttempt) {
          // if last login attempt was within 60 seconds, wait
          if (Date.now() - profile.lastLoginAttempt < 60000) {
            return res.send('Too many failed login attempts. Try again in 60 seconds.')
          }
        }
        profile.lastLoginAttempt = await new Date()
        await profile.save()

        res.send("invalid password")
      }
    } else {
      res.send("Username does not exist")
    }
  } catch(err) {
    console.error(err)
  }
})

// get profile route
router.post('/retrieveProfileInfo', async (req, res) => {

  //res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  let userToRetrieve = await req.body.profile.toLowerCase()

  // account for pressing app back button on original post
  if (userToRetrieve.includes('#')) {
    userToRetrieve = userToRetrieve.split('#')[0]
  }


  // verify token
  const profile = await Profile.findOne({ username: userToRetrieve })

  if (profile) {
    // return counts instead of sending actual whole posts,
    // followers, and following arrays
    if (req.body.profileHeader) {
      res.json({
        username: profile.username,
        description: profile.description,
        profileImage: profile.profileImage,
        postCount: profile.posts.length,
        creationDate: profile.creationDate,
        followerCount: profile.followers.length,
        followingCount: profile.following.length,
        likedPosts: profile.likedPosts,
        likedComments: profile.likedComments,
        profilePicNsfw: profile.profilePicNsfw
      })
    } else {
      res.json({
        username: profile.username,
        description: profile.description,
        profileImage: profile.profileImage,
        posts: profile.posts,
        creationDate: profile.creationDate,
        followers: profile.followers,
        following: profile.following,
        likedPosts: profile.likedPosts,
        likedComments: profile.likedComments,
        profilePicNsfw: profile.profilePicNsfw
      })
    }

  } else {
    res.send("profile not found.")
  }
})

// handle user follow or unfollow
router.post('/userFollowAction', async (req, res) => {

  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.userFollowing })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  const userClickedFollow = req.body.userFollowing
  const userBeingFollowed = req.body.userFollowed

  const profileFollowing = await Profile.findOne({ "username": userClickedFollow })
  const profileBeingFollowed = await Profile.findOne({ "username": userBeingFollowed })

  const followingProfileQuery = { "username": userClickedFollow }
  let followingProfileUpdate
  const followedProfileQuery = { "username": userBeingFollowed }
  let followedProfileUpdate

  if (req.body.isFollowing) {
    // add profile being followed
    // to the follower's profile's following list
    // (if not already in the list)
    if (!profileFollowing.following.includes(userBeingFollowed)) {
      followingProfileUpdate = {
        "$push": {
          "following": userBeingFollowed
        }
      }
    }

    if (!profileBeingFollowed.followers.includes(userClickedFollow)) {
      followedProfileUpdate = {
        "$push": {
          "followers": userClickedFollow
        },
        "$inc": {
          "followerCount": 1
        }
      }
    }

  } else {
    followingProfileUpdate = {
      "$pull": {
        "following": userBeingFollowed
      }
    }
    followedProfileUpdate = {
      "$pull": {
        "followers": userClickedFollow
      },
      "$inc": {
        "followerCount": -1
      }
    }
  }
  if (followingProfileUpdate) {
    await Profile.updateOne(followingProfileQuery, followingProfileUpdate)
      .catch(err => console.error(err))
  }
  // add/remove to/from profile's likedPosts
  if (followedProfileUpdate) {
    await Profile.updateOne(followedProfileQuery, followedProfileUpdate)
      .catch(err => console.error(err))
  }

  res.send('successful follow/unfollow action')
})

// request recovery code for forgotten password (sent to email)
router.post('/requestRecoveryCode', async (req, res) => {
  try {
    const email = req.body.email
    const profile = await Profile.findOne({ email: email })
    if (!profile) {
      return res.send('does not exist')
    }
    if (profile.lastRecoveryCodeSent) {
      // if recovery code was sent within last 5 minutes, deny
      if (Date.now() - profile.lastRecoveryCodeSent < 300000) {
          return res.send('please wait')
      }
    }
    // generate 8-digit code
    let recoveryCode = Math.floor(Math.random() * (89999999) + 10000000)
    profile.recoveryCode = recoveryCode
    profile.lastRecoveryCodeSent = await new Date()
    await profile.save()

    // send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your recovery code is ' + recoveryCode,
      text: 'Your GifShr 8-digit recovery code is: ' + recoveryCode
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    return res.send('sent')
  } catch (err) {
    res.send('error')
    console.error(err)
  }

})

// request password reset
router.post('/requestPasswordReset', async (req, res) => {
  try {
    const email = req.body.email
    const codeEntered = parseInt(req.body.recoveryCode)
    const newPassword = req.body.newPassword
    const profile = await Profile.findOne({ email: email })
    if (!profile) {
      return res.send('error')
    }
    // generated 8-digit code
    if (profile.recoveryCode) {
      if (codeEntered === profile.recoveryCode) {
        profile.password = newPassword
        profile.recoveryCode = null
        await profile.save()
        return res.send('set')
      } else {
        profile.recoveryCode = null
        await profile.save()
        return res.send('incorrect recovery code')
      }
    } else {
      return res.send('error')
    }
  } catch (err) {
    res.send('error')
    console.error(err)
  }

})

// GET 404 error if I don't include this
router.get('/:query', async (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'))
})

// upload new profile image
router.post('/:username/uploadProfileImage', async (req, res) => {
  const token = req.body.tokenInput
  // verify token
  const userProfile = await Profile.findOne({ username: req.params.username })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  let isNewProfilePicNsfw = false
  if (req.body.nsfwPostCheckbox === 'postIsNSFW') {
    isNewProfilePicNsfw = true
  }

  const user = req.params.username.toLowerCase()
  // check if a new profile pic image was NOT passed in
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('no files');
  } else {
    // set profile pic
    const profilePic = req.files.profilePic
    const profilePicType = req.files.profilePic.mimetype

    if (ACCEPTED_IMG_TYPES.includes(profilePicType)) {

      const fileType = profilePicType.split('image/')

      // Use the mv() method to place the file somewhere on your server
      const saveLocation = process.cwd() + '/client/public/'
                            + user
                            + '/profileImages/profile_pic.'
                            + fileType[1]
      // save new profile image to location
      await profilePic.mv(saveLocation, async (err) => {
        if (err)
          console.error(err)

        // set user's profile pic value
        const query = { "username": user }
        const update = {
          "$set": {
            "profileImage": '/' + user + '/profileImages/profile_pic.' + fileType[1],
            "profilePicNsfw": isNewProfilePicNsfw
          }
        }
        await Profile.updateOne(query, update)
          .catch(err => console.error(err))
      });
    }
  }

  // save profile description to textarea value
  const query = { "username": user }
  const update = {
    "$set": {
      "description": req.body.profileDescription
    }
  }
  await Profile.updateOne(query, update)
    .catch(err => console.error(err))

  res.redirect('/profile/' + user)
});

// route to search users (search bar)
router.get('/searchUsers/:user', async (req, res) => {
  const searchQuery = req.params.user.toLowerCase()
  // find users with username including searchQuery
  // create a list of max length 10, sorted by followers
  // in descending order (highest at top)
  const matchingProfiles = await
    Profile.find(
      { username: { $regex: searchQuery, $options: 'i' } })
      .sort({ followerCount: 'descending' })
      .limit(MAX_SEARCH_RESULTS).exec()

  let matchingProfileData = []
  for (i in matchingProfiles) {
    matchingProfileData.push({
      username: matchingProfiles[i].username,
      profileImage: matchingProfiles[i].profileImage,
      description: matchingProfiles[i].description,
      profilePicNsfw: matchingProfiles[i].profilePicNsfw
    })
  }
  res.json(matchingProfileData)
})

router.get('/retrieveProfileImage/:user', async (req, res) => {
  const user = req.params.user.toLowerCase()
  const profile = await Profile.findOne({ username: user })
    .catch(err => console.error(err))
  res.send(profile.profileImage)
})

router.get('/:query/:query', async (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'))
})

module.exports = router
