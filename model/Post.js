const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true
  },
  postId: {
    type: Number,
    required: true
  },
  imageSource: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  videoLink: {
    type: String
  },
  creationDate: {
    type: Date,
    required: true
  },
  likes: [{
    type: String
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  nsfw: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('post', postSchema)
