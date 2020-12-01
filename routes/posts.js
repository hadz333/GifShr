const express = require('express')
const router = express.Router()
const Profile = require('../model/profile.js')
const Post = require('../model/post.js')
const fs = require('fs');
const fetch = require("node-fetch");

// accepted file types: jpg, png, gif
const ACCEPTED_IMG_TYPES = ['image/jpeg', 'image/png', 'image/gif']

// max posts allowed on a profile
const MAX_POSTS = 100000

// ms in a day
const MS_IN_DAY = 86400000

// max age (in days) of post in user's timeline
const TIMELINE_MAX_POST_DAYS_AGO = 7

router.get('/', (req, res) => {
  res.json({"Hello": "Here"})
})

// route to create a new image post
router.post('/:username/createImagePost', async (req, res) => {
  const user = req.params.username.toLowerCase()
  const token = req.body.tokenInput
  // verify token
  const userProfile = await Profile.findOne({ username: req.params.username })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  // get nsfw value
  let isThisPostNSFW
  if (req.body.nsfwPostCheckbox === 'postIsNSFW') {
    isThisPostNSFW = true
  } else {
    isThisPostNSFW = false
  }

  // get post pic
  const postPic = req.files.postPic
  const postPicType = req.files.postPic.mimetype

  if (ACCEPTED_IMG_TYPES.includes(postPicType)) {

    const fileType = postPicType.split('image/')

    // randomly generate a file name with random number
    // if this file name already exists, we will roll again
    let fileName = Math.floor(Math.random() * (MAX_POSTS))

    // get all posts by user
    const usersPosts = await Post.find({ profile: user })
    // get all imageSource values
    let imageSources = []
    for (i in usersPosts) {
      let currentImgSource = usersPosts[i].postId
      await imageSources.push(parseInt(currentImgSource))
    }
    let postIdAlreadyExists = true
    // check if array of imageSources includes fileName
    // while imageSources contains fileName, keep re-rolling until doesn't
    while (postIdAlreadyExists) {
      if (imageSources.includes(fileName)) {
        console.log('post with this id already exists. Generating new ID')
        fileName = Math.floor(Math.random() * (MAX_POSTS))
      } else {
        postIdAlreadyExists = false
      }
    }
    // Use the mv() method to place the file somewhere on your server
    const saveLocation = process.cwd() + '/client/build/'
                          + user
                          + '/' + fileName + '.'
                          + fileType[1]
    const imageSourceString = '/' + user + '/' + fileName + '.' + fileType[1]
    // save new profile image to location
    postPic.mv(saveLocation, async (err) => {
      if (err)
        console.error(err)

      const newPost = new Post({
        profile: user,
        postId: fileName,
        imageSource: imageSourceString,
        description: '',
        creationDate: new Date(),
        likes: [],
        comments: [],
        nsfw: isThisPostNSFW
      })
      // if description is set in form submission, set it here
      if (req.body.postDescription.length > 0) {
        newPost.description = req.body.postDescription
      }
      // add to profile collection
      const query = { "username": user }
      const update = {
        "$push": {
          "posts": newPost
        }
      }
      await Profile.updateOne(query, update)
        .catch(err => console.error(err))

      await newPost.save()

      res.redirect('/profile/' + user)

    });
  } else {
    res.send("File type not accepted. Only PNG, JPG, and GIF files are accepted.")
  }
})

// route to create a new text post
router.post('/:username/createTextPost', async (req, res) => {
  try {
    const user = req.params.username.toLowerCase()
    const title = req.body.title
    const content = req.body.content
    const token = req.body.token

    // verify token is correct
    const userProfile = await Profile.findOne({ username: user })
    const userId = await String(userProfile._id)
    if (token !== userId) {
      return res.send("error")
    }

    let postId = Math.floor(Math.random() * (MAX_POSTS))

    // get all posts by user
    const usersPosts = await Post.find({ profile: user })
    // get all imageSource values
    let postIds = []
    for (i in usersPosts) {
      let currentPostId = usersPosts[i].postId
      await postIds.push(parseInt(currentPostId))
    }
    let postIdAlreadyExists = true
    // check if array of imageSources includes fileName
    // while imageSources contains fileName, keep re-rolling until doesn't
    while (postIdAlreadyExists) {
      if (postIds.includes(postId)) {
        console.log('post with this id already exists. Generating new ID')
        postId = Math.floor(Math.random() * (MAX_POSTS))
      } else {
        postIdAlreadyExists = false
      }
    }

    const newPost = new Post({
      profile: user,
      imageSource: '/text_post.png',
      description: '',
      postId: postId,
      title: title,
      content: content,
      creationDate: new Date(),
      likes: [],
      comments: [],
      nsfw: false
    })
    // add to profile collection
    const query = { "username": user }
    const update = {
      "$push": {
        "posts": newPost
      }
    }
    await Profile.updateOne(query, update)
      .catch(err => console.error(err))

    await newPost.save()

    res.send("success")
  } catch(err) {
    console.error(err)
    res.send("error")
  }
})

// route to create a new video post
router.post('/:username/createVideoPost', async (req, res) => {
  try {
    const user = req.params.username.toLowerCase()
    const videoLink = req.body.videoLink
    const token = req.body.token

    // verify token is correct
    const userProfile = await Profile.findOne({ username: user })
    const userId = await String(userProfile._id)
    if (token !== userId) {
      return res.send("error")
    }

    let postId = Math.floor(Math.random() * (MAX_POSTS))

    // get all posts by user
    const usersPosts = await Post.find({ profile: user })
    // get all imageSource values
    let postIds = []
    for (i in usersPosts) {
      let currentPostId = usersPosts[i].postId
      await postIds.push(parseInt(currentPostId))
    }
    let postIdAlreadyExists = true
    // check if array of imageSources includes fileName
    // while imageSources contains fileName, keep re-rolling until doesn't
    while (postIdAlreadyExists) {
      if (postIds.includes(postId)) {
        console.log('post with this id already exists. Generating new ID')
        postId = Math.floor(Math.random() * (MAX_POSTS))
      } else {
        postIdAlreadyExists = false
      }
    }

    // get the video id so we can retrieve the thumbnail
    let videoId = videoLink.split('watch?v=')[1]
    if (videoId.includes('&')) {
      videoId = videoId.split('&')[0]
    }

    if (videoId.includes('?')) {
      videoId = videoId.split('?')[0]
    }

    const newPost = new Post({
      profile: user,
      imageSource: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg',
      description: req.body.description || '',
      postId: postId,
      videoLink: videoLink,
      creationDate: new Date(),
      likes: [],
      comments: [],
      nsfw: false
    })
    // add to profile collection
    const query = { "username": user }
    const update = {
      "$push": {
        "posts": newPost
      }
    }
    await Profile.updateOne(query, update)
      .catch(err => console.error(err))

    await newPost.save()

    res.send("success")
  } catch(err) {
    console.error(err)
    res.send("error")
  }
})

// route to create a new hub post
router.post('/:username/createHubPost', async (req, res) => {
  console.log('hub post')
  try {
    const user = req.params.username.toLowerCase()
    const videoLink = req.body.videoLink
    const token = req.body.token

    // verify token is correct
    const userProfile = await Profile.findOne({ username: user })
    const userId = await String(userProfile._id)
    if (token !== userId) {
      return res.send("error")
    }

    let postId = Math.floor(Math.random() * (MAX_POSTS))

    // get all posts by user
    const usersPosts = await Post.find({ profile: user })
    // get all imageSource values
    let postIds = []
    for (i in usersPosts) {
      let currentPostId = usersPosts[i].postId
      await postIds.push(parseInt(currentPostId))
    }
    let postIdAlreadyExists = true
    // check if array of imageSources includes fileName
    // while imageSources contains fileName, keep re-rolling until doesn't
    while (postIdAlreadyExists) {
      if (postIds.includes(postId)) {
        console.log('post with this id already exists. Generating new ID')
        postId = Math.floor(Math.random() * (MAX_POSTS))
      } else {
        postIdAlreadyExists = false
      }
    }

    // get thumbnail source
    // get html code for URL
    let response = await fetch(videoLink);
    let template
    switch (response.status) {
        // status "OK"
        case 200:
            template = await response.text();
            break;
        // status "Not Found"
        case 404:
            return res.send("error")
            break;
    }
    // extract specific part we need, this will be imageSource
    // for the thumbnail
    const thumbnailUrlEnding = await template.split('https://ci.phncdn.com/videos')[1].split('"')[0]
    const imageSource = 'https://ci.phncdn.com/videos' + thumbnailUrlEnding

    const newPost = new Post({
      profile: user,
      imageSource: imageSource,
      description: req.body.description || '',
      postId: postId,
      videoLink: videoLink,
      creationDate: new Date(),
      likes: [],
      comments: [],
      nsfw: true
    })
    // add to profile collection
    const query = { "username": user }
    const update = {
      "$push": {
        "posts": newPost
      }
    }
    await Profile.updateOne(query, update)
      .catch(err => console.error(err))

    await newPost.save()

    res.send("success")
  } catch(err) {
    console.error(err)
    res.send("error")
  }
})

// user deleting their post
router.post('/deletePost', async (req, res) => {

  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.username })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  // find the file with postId name in user's folder
  // destroy this file

  fs.unlink(process.cwd() + '/client/build' + req.body.post.imageSource, (err) => {
    if (err) console.log('deleted non-image post')
    console.log(req.body.post.imageSource + ' was deleted');
  });


  // delete from Post collection
  await Post.deleteOne({ _id: req.body.post._id }, function (err) {
    if(err) console.error(err);
  });

  // delete post id from profile's posts array
  await Profile.updateOne({ username: req.body.post.profile }, {
    "$pull": {
      "posts": req.body.post._id
    }
  }, function (err) {
    if(err) console.error(err);
  })

  res.send('success')
})

// route to render PostGrid
router.get('/renderPosts/:username', async (req, res) => {
  const user = req.params.username.toLowerCase()
  // find the user and get posts
  const profile = await
    Profile.findOne({ username: req.params.username.toLowerCase() }).exec()

  if (profile.length < 1) {
    res.send("user not found")
  }
  const profilePosts = profile.posts
  // use profile post IDs to gather all posts
  // return json object of all posts with relevant data
  const posts = await
    Post.find({ _id: profilePosts })
    .sort({creationDate: 'descending'}).exec()

  res.json(posts)
})

// return liked posts of user
router.post('/likedPosts', async (req, res) => {
  // grab likedPosts array from user
  const user = req.body.user.toLowerCase()
  const token = req.body.token

  const retrievedUser = await Profile.findOne({ username: user }).exec()
  // verify token
  const userId = await String(retrievedUser._id)
  if (token !== userId) {
    return res.send("error")
  }
  // grab all posts using the id's
  const allLikedPosts = await Post.find({ _id: retrievedUser.likedPosts })
    .sort({creationDate: 'descending'}).exec()

  // return posts this user liked in JSON format
  res.json(allLikedPosts)
})

// retrieving a specific post by id
router.get('/retrievePostById/:postId', async (req, res) => {
  const post = await
    Post.findOne({ _id: req.params.postId }).exec()

  res.json(post)
})

// retrieve posts for a user's timeline
router.post('/timelinePosts', async (req, res) => {
  // get the profiles this user is following
  const user = await Profile.findOne({ username: req.body.username })
  const token = req.body.token

  // verify token
  const userId = await String(user._id)
  if (token !== userId) {
    return res.send("error")
  }

  // get all of the posts which are:
    // from these profiles
    // within the last 7 days
    // sorted by most recent first
  const timelinePosts = await
    Post.find({ profile: user.following, creationDate: {$gt: new Date(Date.now() - MS_IN_DAY * TIMELINE_MAX_POST_DAYS_AGO)}  })
    .sort({ creationDate: 'descending' }).exec()


  res.json(timelinePosts)
})

// retrieve globally trending posts
router.get('/globalTimelinePosts', async (req, res) => {
  // find posts within last 24 hours
  // create a list of 20 posts, sorted by likes
  // in descending order (highest at top)
  const matchingPosts = await
    Post.find(
      { creationDate: {$gt: new Date(Date.now() - MS_IN_DAY)} })
      .sort({ likeCount: 'descending' })
      .limit(20).exec()
  res.json(matchingPosts)
})

// route to retrieve a single post
router.get('/:user/:postId', async (req, res) => {
  const user = req.params.user.toLowerCase()
  const postId = parseInt(req.params.postId)

  const profile = await
    Profile.findOne({ username: user }).exec()

  if (!profile) {
    res.send("profile does not exist.")
  }

  // TODO: for efficiency, browser server's folder
  // instead of searching all posts oof

  const posts = await
    Post.find({ _id: profile.posts }).exec()

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postId === postId) {
      res.json(posts[i])
    }
  }
  //res.send("post does not exist.")
})

// like or unlike a post
router.post('/userLiked', async (req, res) => {
  const postId = req.body.postId
  const liked = req.body.liked
  const likedBy = req.body.likedBy
  const token = req.body.token

  const postCurrentStatus = await Post.findOne({ "_id": postId })

  const profileCurrentStatus = await Profile.findOne({ "username": likedBy })

  // verify token
  const userId = await String(profileCurrentStatus._id)
  if (token !== userId) {
    return res.send("error")
  }

  const postQuery = { "_id": postId }
  let postUpdate
  const profileQuery = { "username": likedBy }
  let profileUpdate
  if (liked) {
    // push to post's likes
    // *if post's likes doesn't already include this profile
    if (!postCurrentStatus.likes.includes(likedBy)) {
      postUpdate = {
        "$push": {
          "likes": likedBy
        },
        "$inc": {
          "likeCount": 1
        }
      }
    }
    // push to profile's likedPosts
    // *if likedPosts already doesn't include this post
    if (!profileCurrentStatus.likedPosts.includes(postId)) {
      profileUpdate = {
        "$push": {
          likedPosts: postId
        }
      }
    }
  } else {
    // decrease likes by 1
    postUpdate = {
      "$pull": {
        "likes": likedBy
      },
      "$inc": {
        "likeCount": -1
      }
    }
    profileUpdate = {
      "$pull": {
        likedPosts: postId
      }
    }
  }
  const post = await Post.updateOne(postQuery, postUpdate)
    .catch(err => console.error(err))

  // add/remove to/from profile's likedPosts
  const profile = await Profile.updateOne(profileQuery, profileUpdate)
    .catch(err => console.error(err))

  res.send("success")
})

module.exports = router
