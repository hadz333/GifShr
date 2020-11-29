const express = require('express')
const router = express.Router()
const Report = require('../model/report')
const Post = require('../model/post')
const Comment = require('../model/comment')
const Profile = require('../model/profile')
const Ban = require('../model/ban')

router.get('/', (req, res) => {
  res.json({"Hello": "Here"})
})

// add report submissions to database
router.post('/submitReport', async (req, res) => {
  try {
    let newReport
    if (req.body.postId) {
      console.log('new report for post')
      newReport = new Report({
        defendant: req.body.defendant,
        postId: req.body.postId,
        reportDate: req.body.reportDate,
        rulesReported: req.body.rulesReported,
        reportedBy: req.body.reportedBy
      })
    } else if (req.body.commentId) {
      console.log('new report for comment')
      newReport = new Report({
        defendant: req.body.defendant,
        commentId: req.body.commentId,
        reportDate: req.body.reportDate,
        rulesReported: req.body.rulesReported,
        reportedBy: req.body.reportedBy
      })
    } else {
      console.log('new profile report')
      newReport = new Report({
        defendant: req.body.defendant,
        reportDate: req.body.reportDate,
        reportedBy: req.body.reportedBy
      })
    }
    await newReport.save()
    res.send("success")
  } catch(err) {
    console.error(err)
    res.send("failed")
  }
})

// handle report innocent verdict
router.post('/innocentVerdict', async (req, res) => {
  // remove all Reports which reported this postId or commentId
  const report = await Report.findOne({ _id: req.body.reportId })

  if (report.postId) {
    await Report.deleteMany({ postId: report.postId }).exec()
  } else if (report.commentId) {
    await Report.deleteMany({ commentId: report.commentId }).exec()
  } else {
    await Report.deleteMany({ defendant: report.defendant }).exec()
  }
  res.send('success')
})

// handle report guilty verdict
router.post('/guiltyVerdict', async (req, res) => {
  const report = await Report.findOne({ _id: req.body.reportId })

  // get the broken rules and deliver the ban according to
  // the harshest rule broken
  let banDuration = 0
  let rulesBrokenOnCurrentBan = []

  if (req.body.rule4Broken) {
    banDuration = 1
    rulesBrokenOnCurrentBan.push(4)
  }

  if (req.body.rule2Broken) {
    banDuration = 2
    rulesBrokenOnCurrentBan.push(2)
  }

  if (req.body.rule3Broken) {
    banDuration = 2
    rulesBrokenOnCurrentBan.push(3)
  }

  if (req.body.rule5Broken) {
    banDuration = 7
    rulesBrokenOnCurrentBan.push(5)
  }

  if (req.body.rule1Broken && report.postId) {
    banDuration = 10
    rulesBrokenOnCurrentBan.push(1)
  } else if (req.body.rule1Broken) {
    // comment which broke rule 1, 2 day ban (if currently not 7)
    if (banDuration < 7) {
      banDuration = 2
    }
    rulesBrokenOnCurrentBan.push(1)
  }

  // next, remove the post or comment which is guilty
  if (report.postId) {
    // remove post from profile collection's posts array
    const query = { "username": report.defendant }
    const update = {
      "$pull": {
        "posts": report.postId
      }
    }
    await Profile.updateOne(query, update).exec()

    // remove post from post collection
    await Post.deleteOne({ _id: report.postId }).exec()

    // remove all reports including this post (banhammer delivered)
    await Report.deleteMany({ postId: report.postId }).exec()
  } else if (report.commentId) {
    // remove comment
    await Comment.deleteOne({ _id: report.commentId }).exec()

    // remove all reports including this comment (banhammer delivered)
    await Report.deleteMany({ commentId: report.commentId }).exec()
  } else {
    // delete reports with this profile
    await Report.deleteMany({ defendant: report.defendant }).exec()
  }

  // deliver the banhammer

  const currentBanExisting = await Ban.findOne({ profile: report.defendant })

  if (currentBanExisting) {
    if (currentBanExisting.banDuration <= banDuration) {
      // ban them again (with increased duration)
      await Ban.deleteMany({ profile: report.defendant })
      const newBan = new Ban({
        profile: report.defendant,
        timeOfBan: new Date(),
        banDuration: banDuration,
        rulesBrokenOnCurrentBan: rulesBrokenOnCurrentBan
      })
      await newBan.save()
    }
  } else {
    // create new ban for the user
    const newBan = new Ban({
      profile: report.defendant,
      timeOfBan: new Date(),
      banDuration: banDuration,
      rulesBrokenOnCurrentBan: rulesBrokenOnCurrentBan
    })
    await newBan.save()
  }

  res.json('success')
})

// check ban status of profile
router.get('/checkBanStatus/:username', async (req, res) => {
  const currentBanExisting = await Ban.findOne({ profile: req.params.username })

  if (currentBanExisting) {
    res.send("exists")
  } else {
    res.send("does not exist")
  }

})

module.exports = router
