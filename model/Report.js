const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  defendant: {
    type: String,
    required: true
  },
  postId: {
    type: String
  },
  commentId: {
    type: String
  },
  reportDate: {
    type: Date,
    required: true
  },
  rulesReported: [{
    type: Number
  }],
  guilty: {
    type: Boolean
  },
  reportedBy: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('report', reportSchema)
