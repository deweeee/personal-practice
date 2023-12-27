import { LocalConf, SrvConf } from 'httpConfig'
import Http from './http'
let httpUntil = new Http({ type: 'fetch' })
httpUntil
  .setOvertime(30 * 10000)
  .setCookieCors()
  .setHeader({
    Accept: 'application/json',
    invoke_source: SrvConf.invoke_source
  })

export default {
  async setHeader({ key, val }) {
    httpUntil.setHeader(key, val)
  },

  async setGlobalHeader({ key, val }) {
    httpUntil.setGlobalHeader(key, val)
  },

  async getU(url, params = {}) {
    let res = await httpUntil
      .setUrl(
        typeof params === 'string'
          ? LocalConf.baseUrl + url + '/' + 'params'
          : LocalConf.baseUrl + url
      )
      .setMethod('GET')
      .setBody(params)
      .send()
      .then((data) => data)
      .catch((error) => {
        console.warn('getU:', error)
      })
    return res
  },

  async post(url, params = {}) {
    if (!httpUntil.headers.TOKEN && location.href.indexOf('/login') < 0) {
      return { code: 'BACK' }
    }
    let res = await httpUntil
      .setBodyType('urlSearch')
      .setUrl(LocalConf.baseURL + url)
      .setMethod('POST')
      .setBody(params)
      .send()
      .then((data) => data)
      .catch((error) => {
        console.warn('post: ', error)
      })
    return res
  },

  async postJson(url, params = {}) {
    if (!httpUntil.headers.TOKEN && location.href.indexOf('/login') < 0) {
      return { code: 'BACK' }
    }
    let res = await httpUntil
      .setBodyType('json')
      .setUrl(LocalConf.baseURL + url)
      .setMethod('POST')
      .setBody(params)
      .send()
      .then((data) => data)
      .catch((error) => {
        console.warn('postJson: ', error)
      })
    return res
  },

  async upload(url, params = {}) {
    let res = await httpUntil
      .setBodyType('file')
      .setOvertime(3000000000000)
      .setUrl(LocalConf.baseURL + url)
      .setMethod('POST')
      .setBody(params)
      .send()
      .then((data) => data)
      .catch((error) => {
        console.warn('upload: ', error)
      })
    return res
  },

  async download(url, params = {}) {
    let res = await httpUntil
      .setBodyType('json')
      .setUrl(LocalConf.baseURL + url)
      .setMethod('POST')
      .setBody(params)
      .setReturnType('blob')
      .send()
      .then((data) => data)
      .catch((error) => {
        console.warn('download: ', error)
      })
    return res
  }
}
