import http from '../http'
import { Message, MessageBox } from 'element-ui'
import $router from '../router'
import {
  SUCCESS,
  OVER_TIME,
  TOKEN_OVERTIME,
  TOKEN_ERROR,
  FORCE_OFFLINE,
  OTHER_PLACE_LOGIN_FORCE_OFFLINE
} from '../conf/response.code.conf'

const stateMiddleWare = async (data, next) => {
  switch (data.code) {
    case 'BACK':
      //没有token header 返回登陆
      $router.push('/login')
      return data
    case SUCCESS:
      data.status = true
      return data
    case OVER_TIME:
      data.status = false
      Message.warning(data.message)
      return data
  }
}
let service = {
  async getU(url, params = {}) {
    try {
      const data = await http.getU(url, params)
      const wareRE = await stateMiddleWare(data, { DO: http.getU, url, params })
      return wareRE
    } catch (err) {
      return {
        code: '000000',
        err
      }
    }
  },
  async post(url, params = {}) {
    try {
      let TOKEN = sessionStorage.TOKEN
      //判断登录状态屏蔽请求
      let re =
        [
          'getEncryptInfo',
          'admin/login',
          'listFunctionAndPage',
          'listResource',
          'sysLanguageType',
          'getCurrentGuest',
          'sendByLoginName'
        ].findIndex((v) => url.indexOf(v) >= 0) >= 0
      if (TOKEN || re) {
        const data = await http.post(url, params)
        const wareRE = await stateMiddleWare(data, {
          DO: http.post,
          url,
          params
        })
        return wareRE
      }
    } catch (err) {
      return {
        code: '000000',
        err
      }
    }
  },
  async upload(url, params = {}) {
    try {
      const data = await http.upload(url, params)
      const wareRE = await stateMiddleWare(data, {
        DO: http.upload,
        url,
        params
      })
      return wareRE
    } catch (err) {
      return {
        code: '000000',
        err
      }
    }
  },
  async download(url, params = {}) {
    try {
      const data = await http.download(url, params)
      return data
    } catch (err) {
      return {
        code: '000000',
        err
      }
    }
  },
  async postJson(url, params = {}) {
    try {
      const data = await http.postJson(url, params)
      const wareRE = await stateMiddleWare(data, {
        DO: http.postJson,
        url,
        params
      })
      return wareRE
    } catch (err) {
      return {
        code: '000000',
        err
      }
    }
  },
  async setHeader({ key, val }) {
    await http.setHeader({
      key,
      val
    })
  },
  async setGlobalHeader({ key, val }) {
    await http.setGlobalHeader({
      key,
      val
    })
  }
}
export default service