const mongoose = require('mongoose')

const banSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true
  },
  timeOfBan: {
    type: Date,
    required: true
  },
  banDuration: {
    type: Number,
    required: true
  },
  rulesBrokenOnCurrentBan: [{
    type: Number,
    required: true
  }]
})

module.exports = mongoose.model('ban', banSchema)
