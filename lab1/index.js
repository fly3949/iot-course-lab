const http = require('http')
const fs = require('fs')

class RenderEngine {
  constructor () {
    this.filename = ''
    this.rawContent = ''
    this.renderResult = ''
  }

  /**
   * 加载模板文件
   */
  loadTemplate (filename) {
    this.filename = filename
    this.rawContent = fs.readFileSync(this.filename, 'utf-8')
  }

  /**
   * 置入数据
   */
  setData (data) {
    Object.entries(data).forEach(([key, value]) => {
      this.renderResult = this.rawContent.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
  }

  /**
   * 输出渲染结果
   */
  renderHTML () {
    return this.renderResult
  }
}

/**
 * 格式化时间字符串
 * @param {*} time
 * @returns {string}
 */
function formatDate (time) {
  const date = new Date(time || Date.now())

  const YY = date.getFullYear()
  const MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

  return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
}

// 创建服务器并监听请求
const tmp = new RenderEngine()
const templatePath = 'template.html'
tmp.loadTemplate(templatePath)

const server = http.createServer((req, res) => {
  tmp.setData({
    time: formatDate()
  })
  res.end(tmp.renderHTML())
})

server.listen(3000)
