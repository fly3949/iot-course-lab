const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')
const app = express()
const port = 3000

const db = new JsonDB(new Config('db/users', true, false, '/'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().single('file'))

app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.set('view engine', 'html')

const getDefaultData = () => {
  return {
    id: '',
    name: '',
    classes: '',
    desc: '',
    avatar: ''
  }
}

app.get('/', (req, res) => {
  res.render('main', {
    title: 'IoT Lab 3',
    ...getDefaultData()
  })
})

app.post('/', (req, res) => {
  let fileName = ''
  let filePath = ''
  if (req.file) {
    const buffer = req.file.buffer
    fileName = Date.now() + path.parse(req.file.originalname).ext // 用时间戳瞎搞一下，作业而已
    filePath = `uploads/${fileName}`
    fs.ensureFileSync(filePath)
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

  db.push(`users/${req.body.id}`, data)

  res.render('main', {
    title: 'IoT Lab 3',
    ...data
  })
})

app.post('/query', (req, res) => {
  const { id } = req.body
  const dbKey = `users/${id}`
  let data = {}
  if (db.exists(dbKey)) {
    data = db.getData(dbKey)
  }
  res.render('main', {
    title: 'IoT Lab 3',
    ...getDefaultData(),
    ...data
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
