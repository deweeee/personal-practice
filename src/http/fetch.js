/*该库是fetch的polyfill,首先判断浏览器是否原生支持fetch，否则结合Promise使用XMLHttpRequest的方式来实现；这正是whatwg-fetch的实现思路，而同构应用中使用的isomorphic-fetch，其客户端fetch的实现是直接require whatwg-fetch来实现的。 */
import fetch from 'isomorphic-fetch'

class FetchUtil {
  constructor(options) {
    this.return_type = options.return_type
  }
  init(url, options) {
    this.url = url
    this.overtime = options.overtime
    this.firstThen = options.firstThen
    this.options = options
    return this
  }
  send() {
    return Promise.race([
      fetch(this.url, this.options),
      new Promise((resolve, reject) => {
        setTimeout(
          () => {
            reject(new Error('response timeout'))
          },
          this.overtime ? this.overtime : 10000
        )
      })
    ])
      .then((res) => {
        if (this.firstThen) {
          let tempResponse = this.firstThen(res)
          if (tempResponse) return tempResponse
        }
        return res
      })
      .then((response) => {
        switch (this.return_type) {
          case 'json':
            return response.json()
          case 'text':
            return response.text()
          case 'blob':
            return response
          case 'formData':
            return response.formData()
          case 'arrayBuffer':
            return response.arrayBuffer()
          default:
            return response.json()
        }
      })
  }
}
export default FetchUtil
