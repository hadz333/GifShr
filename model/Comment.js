const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: String
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId
  }],
})

module.exports = mongoose.model('Comment', commentSchema)
