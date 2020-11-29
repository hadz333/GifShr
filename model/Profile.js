const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  profileImage: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  creationDate: {
    type: Date,
    required: true
  },
  followers: [{
    type: String
  }],
  followerCount: {
    type: Number,
    default: 0
  },
  following: [{
    type: String
  }],
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  likedComments: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  // preferences
  darkMode: {
    type: Boolean,
    default: false
  },
  showNsfw: {
    type: Boolean,
    default: false
  },
  autoShowNsfw: {
    type: Boolean,
    default: false
  },
  autoCheckNsfwOnPosts: {
    type: Boolean,
    default: false
  },
  profilePicNsfw: {
    type: Boolean,
    default: false
  },
  recoveryCode: {
    type: Number
  },
  lastRecoveryCodeSent: {
    type: Date
  },
  lastLoginAttempt: {
    type: Date
  },
})

module.exports = mongoose.model('Profile', profileSchema)
