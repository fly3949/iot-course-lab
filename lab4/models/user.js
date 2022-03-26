const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017/'

class User {
  constructor () {
    this.client = new MongoClient(url)
  }

  /**
   * 查询所有用户
   */
  async queryAll () {
    try {
      await this.client.connect()
      const db = this.client.db('iot-lab4')
      const collection = db.collection('users')
      const res = await collection.find().toArray()
      return res
    } finally {
      this.client.close()
    }
  }

  /**
   * 查询单个用户
   * @param {number} id
   */
  async queryByID (id) {
    try {
      await this.client.connect()
      const db = this.client.db('iot-lab4')
      const collection = db.collection('users')
      const res = await collection.findOne({ id })
      return res
    } finally {
      this.client.close()
    }
  }

  /**
   * 创建或修改用户
   * @param {*} user 用户对象
   */
  async save (user) {
    try {
      await this.client.connect()
      const db = this.client.db('iot-lab4')
      const collection = db.collection('users')
      const res = await collection.updateOne(
        {
          id: user.id
        }, {
          $set: user
        }, {
          upsert: true
        })
      return res
    } finally {
      this.client.close()
    }
  }

  /**
   * 删除用户
   * @param {number} id 用户学号
   */
  async delete (id) {
    try {
      await this.client.connect()
      const db = this.client.db('iot-lab4')
      const collection = db.collection('users')
      const res = await collection.deleteOne({ id })
      return res
    } finally {
      this.client.close()
    }
  }
}

module.exports = {
  User
}
