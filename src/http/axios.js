import axios from 'axios'
class XhrUtil {
  init(url, options) {
    this.url = url
    this.options = {
      method: options.method,
      headers: options.headers,
      data: options.body,
      // If the request takes longer than `timeout`, the request will be aborted.
      timeout: options.overtime
    }
    return this
  }

  async send() {
    axios.defaults.withCredentials = true //This will automatically send the cookie to the client-side.
    const response = await axios(
      Object.assign({ url: this.url }, this.options)
    ).then((response) => response)
    if (response.status === 200) return response.data
  }
}
export default XhrUtil
