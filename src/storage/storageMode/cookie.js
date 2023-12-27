import Cookies from 'js-cookie'
const cookie = new (class {
  constructor() {
    this.$date = 604800000
  }
  $get({ key }) {
    if (key) {
      let init = JSON.parse(Cookies.getItem(key))
      if (!init) {
        return undefined
      }
      return init[0]
    }
  }
  $set({ key, parameter, date = this.$date, refresh = false }) {
    if (key && parameter) {
      let getData = this.$get(key)
      if (!getData || refresh) {
        this.$surplus()
        let time = new Date(new Date().getTime() + date)
        Cookies.set(key, JSON.stringify(parameter), { expires: time })
      }
      return getData
    }
  }
  $remove({ key }) {
    Cookies.remove(key)
    console.warn('Cookies清除用户数据')
  }
  $surplus() {
    if (document.cookie.length > 3000) {
      console.warn(
        `cookie长度总量已达${document.cookie.length}字节,cookie总长度不能超过4096`
      )
    }
  }
  $timeDetermine(init) {
    let newDate = new Date().getTime()
    return init[1] - newDate > 0
  }
})()
export default cookie
