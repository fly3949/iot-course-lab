const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs') // PPT 里写了所以可以用哦💗
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().single('file'))

app.engine('.html', ejs.__express)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'results')))
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
    fileName = Date.now() + path.parse(req.file.originalname).ext // 用时间戳瞎搞一下
    filePath = `uploads/${fileName}`
    fs.writeFileSync(filePath, buffer)
  }

  const { id, name, classes, desc } = req.body

  const data = {
    title: 'IoT Lab 3',
    ...getDefaultData(),
    id,
    name,
    classes,
    desc,
    avatar: fileName
  }

  ejs.renderFile('views/main.html', data, {}, (err, str) => {
    if (err) throw err
    fs.writeFileSync(`results/${id}.html`, str) // 不能用 DB 就只能这样了呜呜呜
  })

  res.render('main', data)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
