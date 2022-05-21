const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/lab5')

const User = mongoose.model('User', { name: String, createdAt: Date, random: Number })

app.get('/user', async (req, res) => {
  const list = await User.find()
  res.json({
    status: 200,
    message: 'success',
    data: list
  })
})

app.post('/user', async (req, res) => {
  const { name, createdAt, random } = req.body
  const user = new User({ name, createdAt, random })
  await user.save()

  res.json({
    status: 200,
    message: 'success'
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
