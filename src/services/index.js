import { Message, Loading } from 'element-ui'
import storageM from '../storage'
import service from './service'
import { TOKEN_OVERTIME, SUCCESS } from '../config/response.code.conf'
import Vue from 'vue'

const ServiceConf = {}
export default {
  async postLoading({
    type,
    url,
    params = {},
    storageType = 'sessionStorage',
    cache = false,
    stopMsg = false,
    refresh = false
  }) {
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    const $loading = Loading.service({
      target: document.querySelector('div.contain'),
      lock: true,
      fullscreen: false,
      // text: language.strLanguage('common-loading'),
      text: '加载中',
      customClass: 'myLoadingIcon',
      background: 'transparent'
    })
    if (document.querySelector('div.contain') == null) {
      //屏蔽 页面未加载完成导致加载框以Body为载体的显示重复
      $loading.close()
    }
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.postJson(urlKey, params)
    $loading.close()
    if (res.status || res.code == SUCCESS) {
      if (cache) {
        storage.$set({ key: urlKey, parameter: res })
      }
    } else if (!stopMsg && res.code !== 'BACK') {
      Message.closeAll()
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async postJson({
    type,
    url,
    params = {},
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.postJson(urlKey, params)
    if (res && (res.status || res.code == SUCCESS)) {
      if (cache) {
        storage.$set({
          key: urlKey,
          parameter: res
        })
      }
    } else if (res && res.code !== 'BACK') {
      Message.closeAll()
      res.status = false
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async postStorage({
    type,
    url,
    params = '',
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    if (cache) {
      //携带接口主键以id值传入
      let key = `${urlKey}?id=${params.id}`
      let storageData = storage.$get({ key })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.postJson(urlKey, params)
    if (res.status || res.code == SUCCESS) {
      if (cache) {
        let key = `${urlKey}?id=${params.id}`
        storage.$set({
          key,
          parameter: res
        })
      }
    } else if (res.code !== 'BACK') {
      Message.closeAll()
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async getU({
    type,
    url,
    params = {},
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.getU(urlKey, params)
    if (res && (res.status || res.code == SUCCESS)) {
      if (cache) {
        storage.$set({
          key: urlKey,
          parameter: res
        })
      }
    } else if (res && res.code !== 'BACK') {
      Message.closeAll()
      res.status = false
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async postParams({
    type,
    url,
    params = '',
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}/${params}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.post(urlKey, params)
    if (res && res.data && res.data.sysGridDicListList) {
      if (cache) {
        storage.$set({
          key: urlKey,
          parameter: res
        })
      }
    } else if (res.code !== 'BACK') {
      Message.closeAll()
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async post({
    type,
    url,
    params = {},
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    if (urlKey.indexOf('undefined') > -1) return
    const storage = storageM[storageType]
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.post(urlKey, params)
    if (res && (res.status || res.code == SUCCESS)) {
      if (cache) {
        storage.$set({
          key: urlKey,
          parameter: res
        })
      }
    } else if (res && res.code !== 'BACK') {
      Message.closeAll()
      res.status = false
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      Message.error(msg)
    }
    return res
  },

  async postUrlParams({
    type,
    url,
    urlParams = '',
    params = '',
    storageType = 'sessionStorage',
    cache = false,
    refresh = false
  }) {
    let urlData = ''
    if (typeof urlParams === 'object') {
      Object.keys(urlParams).forEach((index) => {
        urlData += `&${index}=${encodeURI(urlParams[index])}`
      })
    }
    urlData = urlData.substring(1)
    let urlKey = ''
    if (ServiceConf[type][url]) {
      urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}?${urlData}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    const $loading = Loading.service({
      target: document.querySelector('div.contain'),
      lock: true,
      fullscreen: false,
      // text: language.strLanguage('common-loading'),
      text: '加载中',
      customClass: 'myLoadingIcon',
      background: 'transparent'
    })
    if (cache) {
      let storageData = storage.$get({ key: urlKey })
      if (storageData && !refresh) {
        return storageData
      }
    }
    let res = await service.upload(urlKey, params)
    $loading.close()
    if (res.status && res.data) {
      if (cache) {
        storage.$set({
          key: urlKey,
          parameter: res
        })
      }
    } else if (res.code !== 'BACK') {
      Message.closeAll()
      const msg =
        res.code == TOKEN_OVERTIME
          ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : Vue.prototype.$mt('common-apiError') || '操作异常'
      res.status ? Message.success(msg) : Message.error(msg)
    }
    return res
  },

  async download({ type, url, params = {} }) {
    let urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    const $loading = Loading.service({
      target: document.querySelector('div.contain'),
      lock: true,
      fullscreen: false,
      // text: language.strLanguage('common-loading'),
      text: '加载中',
      customClass: 'myLoadingIcon',
      background: 'transparent'
    })
    if (document.querySelector('div.contain') == null) {
      //屏蔽 页面未加载完成导致加载框以Body为载体的显示重复
      $loading.close()
    }
    let res = await service.download(urlKey, params)
    $loading.close()
    return res
  },

  async downloadExcel({ type, url, params = {} }) {
    let urlKey = `${ServiceConf[type]['$getWay']}/${ServiceConf[type][url]}`
    !params.apiUrl
      ? (params.apiUrl = `${ServiceConf[params.p_type]['$getWay']}/${
          ServiceConf[params.p_type][params.p_url]
        }`)
      : ''
    let res = await service.download(urlKey, params)
    return res
  },

  async setHeader({ key, val }) {
    await service.setHeader({
      key,
      val
    })
  },

  async setGlobalHeader({ key, val }) {
    await service.setGlobalHeader({
      key,
      val
    })
  }
}
