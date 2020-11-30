const express = require('express')
const router = express.Router()
const Profile = require('../model/profile.js')
const Post = require('../model/post.js')
const Comment = require('../model/comment.js')
const fs = require('fs');

router.get('/', (req, res) => {
  res.json({"Hello": "Here"})
})

// post a new comment reply
router.post('/reply', async (req, res) => {

  // verify user is truly logged in
  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.user })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  const commentText = req.body.commentText
  const commentToAddReply = req.body.commentToAddReply

  // create new comment
  const newComment = new Comment({
    profile: req.body.user,
    content: commentText,
    likes: []
  })

  // add reply to comment
  // findOne with comment ID and update with pushing newComment to replies

  const query = { "_id": commentToAddReply }
  const update = {
    "$push": {
      "replies": newComment
    }
  }
  const comment = await Comment.updateOne(query, update)
    .catch(err => console.error(err))

  // add comment to comments document as well
  await newComment.save()

  res.send("success")
})

// get replies for a comment
router.get('/replies/:commentId', async (req, res) => {
  const commentId = req.params.commentId
  const comment = await Comment.findOne({ _id: commentId })
    .catch(err => console.error(err))

  const replies = await Comment.find({ _id: comment.replies })
    .sort({ likes: 'descending' })
    .catch(err => console.error(err))

  res.json(replies)
})

// post a new comment
router.post('/post', async (req, res) => {

  // verify user is truly logged in
  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.user })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  const commentText = req.body.commentText
  const postToCommentOnId = req.body.postId

  // create new comment
  const newComment = new Comment({
    profile: req.body.user,
    content: commentText,
    likes: []
  })

  // add comment to post
  // findOne with post ID and update with pushing newComment to comments

  const query = { "_id": postToCommentOnId }
  const update = {
    "$push": {
      "comments": newComment
    }
  }
  const post = await Post.updateOne(query, update)
    .catch(err => console.error(err))

  // add comment to comments document as well
  await newComment.save()

  res.send("success")
})

// retrieve a specific comment by id
router.get('/retrieveCommentById/:commentId', async (req, res) => {
  const comment = await Comment.findOne({ "_id": req.params.commentId })
    .catch(err => console.error(err))
  res.json(comment)
})

router.post('/deleteComment', async (req, res) => {
  // verify user is truly logged in
  const token = req.body.token
  // verify token
  const userProfile = await Profile.findOne({ username: req.body.user })
  const userId = await String(userProfile._id)
  if (token !== userId) {
    return res.send("error")
  }

  // delete from comment collection
  await Comment.deleteOne({ _id: req.body.commentId }, function (err) {
    if(err) console.error(err);
  });

  // delete comment id from the post's comments array
  await Post.updateOne({ _id: req.body.postId }, {
    "$pull": {
      "comments": req.body.commentId
    }
  }, function (err) {
    if(err) console.error(err);
  })

  res.send('success')
})

// retrieve all comments on this post
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId

  const post = await Post.findOne({ _id: postId })
    .catch(err => console.error(err))

  const comments = await Comment.find({ _id: post.comments })
    .sort({ likes: 'descending' })
    .catch(err => console.error(err))

  res.json(comments)
})

// like or unlike a comment
router.post('/userLiked', async (req, res) => {

  const token = req.body.token

  const commentId = req.body.commentId
  const liked = req.body.liked
  const likedBy = req.body.likedBy

  const commentCurrentStatus = await Comment.findOne({ "_id": commentId })

  const profileCurrentStatus = await Profile.findOne({ "username": likedBy })

  const userId = await String(profileCurrentStatus._id)
  if (token !== userId) {
    return res.send("error")
  }

  const commentQuery = { "_id": commentId }
  let commentUpdate
  const profileQuery = { "username": likedBy }
  let profileUpdate
  if (liked) {
    // increase likes by 1
    if (!commentCurrentStatus.likes.includes(likedBy)) {
      commentUpdate = {
        "$push": {
          "likes": likedBy
        }
      }
    }
    if (!profileCurrentStatus.likedComments.includes(commentId)) {
      profileUpdate = {
        "$push": {
          likedComments: commentId
        }
      }
    }
  } else {
    // decrease likes by 1
    commentUpdate = {
      "$pull": {
        "likes": likedBy
      }
    }
    profileUpdate = {
      "$pull": {
        likedComments: commentId
      }
    }
  }
  const comment = await Comment.updateOne(commentQuery, commentUpdate)
    .catch(err => console.error(err))

  // add/remove to/from profile's likedComments
  const profile = await Profile.updateOne(profileQuery, profileUpdate)
    .catch(err => console.error(err))

  res.send("success")
})

// retrieve all of a user's liked comments
router.get('/:username/likedComments', async (req, res) => {
  const username = req.params.username.toLowerCase()
  // get liked comments from username
  const profile = await Profile.findOne({ username: username })
    .catch(err => console.error(err))
  res.json(profile.likedComments)
})



module.exports = router
