import fetch from './fetch'
import axios from './axios'
class HttpUtil {
  constructor(options) {
    this.type = options.type ? options.type : 'fetch'
    this.init()
  }
  init() {
    this.url = ''
    this.method = 'GET'
    this._headers = {}
    this.headers = {}
    this.body_type = 'form'
    this.bodys = {}
    //credentials 选项指定 fetch 是否应该随请求发送 cookie 和 HTTP-Authorization header。'omit'不发送,即便对于同源请求
    this.credentials = 'omit'
    this.return_type = 'json'
    this.overtime = 0
    this.firstThen = undefined
    this.fetchUntil = new fetch({ return_type: this.return_type })
    this.xhrUntil = new axios()
    return this
  }
  setOvertime(value) {
    this.overtime = value
    return this
  }
  setCookieCors() {
    this.credentials = 'include'
    return this
  }
  setCookieOrigin() {
    this.credentials = 'same-origin' //"same-origin" —— 默认值，对于跨源请求不发送
    return this
  }
  setUrl(url) {
    this.url = url
    return this
  }
  setMethod(val) {
    this.method = val
    return this
  }
  setBody(name, val) {
    this.bodys = {}
    if (this.body_type === 'file') {
      this.bodys = name
      return this
    }
    if (typeof name === 'string') {
      this.bodys[name] = val
    } else if (typeof name === 'object') {
      this.bodys = name
    }
    return this
  }
  setReturnType(val) {
    this.return_type = val
    return this
  }
  setBodyType(val) {
    this.body_type = val
    return this
  }
  setGlobalHeader(name, val = null) {
    if (typeof name === 'string') {
      this._headers[name] = val
    } else if (typeof name === 'object') {
      Object.keys(name).map((key) => {
        this._headers[key] = name[key]
      })
    }
    return this
  }
  setHeader(name, val = null) {
    if (typeof name === 'string') {
      this.headers[name] = val
    } else if (typeof name === 'object') {
      Object.keys(name).forEach((key) => {
        this.headers[key] = name[key]
      })
    }
  }
  async send() {
    let options = {}
    options.method = this.method
    options.credentials = this.credentials
    if (Object.keys(this.bodys).length !== 0 && this.method !== 'GET') {
      if (this.body_type === 'form') {
        this.setHeader(
          'Content-Type',
          'application/x-www-form-urlencoded;charset=UTF-8'
        )
        let data = ''
        Object.keys(this.bodys).map((key) => {
          let param = encodeURI(this.bodys[key])
          data += `${key}=${param}`
        })
        options.body = data
      } else if (this.body_type === 'file') {
        delete this.headers['Content-Type']
        delete this._headers['Content-Type']
        options.headers = {}
        let data = new FormData()
        data.append('files', this.bodys)
        options.body = data
      } else if (this.body_type === 'json') {
        this.setHeader('Content-Type', 'application/json')
        options.body = JSON.stringify(this.bodys)
      } else if (this.body_type === 'urlSearch') {
        this.setHeader(
          'Content-Type',
          'application/x-www-form-urlencoded;charset=UTF-8'
        )
        let data = new URLSearchParams()
        Object.keys(this.bodys).map((key) => {
          data.append(key, this.bodys[key])
        })
        options.body = data ? data : ''
      } else {
        let data = ''
        Object.keys(this.bodys).map((key) => {
          let param = encodeURI(this.bodys[key])
          data += `&${key}=${param}`
        })
        data = data.replace('&', '?')
        this.bodys = {}
        this.url = this.url + data
      }
      options.headers = Object.assign(this._headers, this.headers)
      options.return_type = this.return_type
      options.overtime = this.overtime
      let res = ''
      if (this.type === 'fetch') {
        res = await this.fetchUntil
          .init(this.url, options)
          .send()
          .then((data) => {
            return data
          })
      } else {
        res = await this.xhrUntil
          .init(this.url, options)
          .send()
          .then((data) => {
            return data
          })
      }
      return res
    }
  }
}
export default HttpUtil
