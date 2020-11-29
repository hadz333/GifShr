const express = require('express')
const router = express.Router()
const Report = require('../model/report')

// list of all admins with admin powers
const ADMIN_POWERS = ['jeffrey7']

// admin base route
router.get('/', (req, res) => {
  res.json({"Hello": "Here"})
})

router.get('/a8b010/:username', async (req, res) => {
  if (ADMIN_POWERS.includes(req.params.username)) {
    console.log('you are an admin, welcome in')

    const reports = await Report.find({ }).exec()

    res.json(reports)
  } else {
    res.send('You are not an admin.')
  }
})

module.exports = router
