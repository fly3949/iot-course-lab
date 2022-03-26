const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs') // PPT 里写了所以可以用哦💗
const app = express()
const port = 3000

const { User } = require('./models/user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().single('file'))

app.engine('.html', ejs.__express)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.set('view engine', 'html')

const userModel = new User()

const getDefaultData = () => {
  return {
    id: '',
    name: '',
    classes: '',
    desc: '',
    avatar: ''
  }
}

app.get('/', async (req, res) => {
  const { successText } = req.query

  const list = await userModel.queryAll()
  res.render('list', {
    title: 'IoT Lab 4',
    list,
    successText
  })
})

app.get('/add', (req, res) => {
  res.render('edit', {
    title: 'IoT Lab 4 - Add',
    ...getDefaultData()
  })
})

app.get('/edit', async (req, res) => {
  const { id } = req.query
  const data = await userModel.queryByID(id)

  res.render('edit', {
    title: 'IoT Lab 4 - Edit',
    ...getDefaultData(),
    ...data
  })
})

app.post('/delete', async (req, res) => {
  const { id } = req.body
  await userModel.delete(id)
  res.redirect('/?successText=删除成功')
})

app.post('/save', async (req, res) => {
  let fileName = ''
  let filePath = ''
  if (req.file) {
    const buffer = req.file.buffer
    fileName = Date.now() + path.parse(req.file.originalname).ext // 用时间戳瞎搞一下
    filePath = `uploads/${fileName}`
    fs.writeFileSync(filePath, buffer)
  }

  const { id, name, classes, desc } = req.body

  const data = {
    ...getDefaultData(),
    id,
    name,
    classes,
    desc,
    avatar: fileName
  }

  await userModel.save(data)

  res.redirect('/?successText=操作成功')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
