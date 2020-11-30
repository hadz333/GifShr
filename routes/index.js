const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

router.get('/:query', async (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'))
})

router.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

module.exports = router
