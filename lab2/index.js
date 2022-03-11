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
    this.renderResult = this.rawContent
    Object.entries(data).forEach(([key, value]) => {
      this.renderResult = this.renderResult.replace(new RegExp(`{{${key}}}`, 'g'), value)
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
function formatTime (fmt, time) {
  const date = new Date(time || Date.now())

  let ret
  const opt = {
    'Y+': date.getFullYear().toString(),
    'M+': (date.getMonth() + 1).toString(),
    'D+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'm+': date.getMinutes().toString(),
    's+': date.getSeconds().toString()
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    };
  };
  return fmt
}

// 创建服务器并监听请求
const tmp = new RenderEngine()
const templatePath = 'html-2.html'
tmp.loadTemplate(templatePath)

const server = http.createServer((req, res) => {
  tmp.setData({
    date: formatTime('YYYY-MM-DD'),
    time: formatTime('HH:mm:ss')
  })
  res.end(tmp.renderHTML())
})

server.listen(3000)
