let session = new (class {
  constructor() {
    this.$date = 604800000
    this.sessionStorage = window.sessionStorage
  }
  $timeDetermine(init) {
    let newDate = new Date().getTime()
    return init[1] - newDate > 0
  }
  $remove({ key }) {
    this.sessionStorage.removeItem(key)
    console.warn('localStorage清除用户数据')
  }
  $get({ key }) {
    if (key) {
      let init = this.sessionStorage.getItem(key)
      if (!init) {
        return undefined
      }
      init = JSON.parse(init)
      if (this.$timeDetermine(init)) {
        return init[0]
      }
      console.warn(`sessionStorage${key}数据内容已过期`)
      this.$remove()
      return undefined
    }
  }
  $set({ key, parameter, date = this.$date, refresh = false }) {
    if (key && parameter) {
      let getData = this.$get(key)
      if (!getData || refresh) {
        let overdueTime = new Date().getTime() + date
        let arrayData = [parameter, overdueTime]
        this.sessionStorage.setItem(key, JSON.stringify(arrayData))
      } else {
        return getData
      }
    }
  }
})()
export default session
