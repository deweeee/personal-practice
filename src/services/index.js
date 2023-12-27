import { Message, Loading } from 'element-ui'
import storageM from '../storage'
import service from './service'
import { TOKEN_OVERTIME, SUCCESS } from '../conf/response.code.conf'

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
      urlKey = `${ServiceConf[type]['$getway']}/${ServiceConf[type][url]}`
    } else {
      return false
    }
    const storage = storageM[storageType]
    const $loading = Loading.service({
      target: document.querySelector('div.contain'),
      lock: true,
      fullscreen: false,
      // text: language.strLanguage('common-loading'),
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
          ? // ? Vue.prototype.$mt('common-apiError2') || '长时间未操作，请重新登录'
            '长时间未操作，请重新登录'
          : res.message
          ? res.message
          : // : Vue.prototype.$mt('common-apiError') || '操作异常'
            '操作异常'
      Message.error(msg)
    }
    return res
  }
}
