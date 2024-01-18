import http from '../http'
import { Message, MessageBox } from 'element-ui'
import $router from '../router'
import utils from '../utils/storage'
import store from '../store'

import {
  SUCCESS,
  OVER_TIME,
  TOKEN_OVERTIME,
  TOKEN_ERROR,
  FORCE_OFFLINE,
  OTHER_PLACE_LOGIN_FORCE_OFFLINE
} from '../config/response.code.conf'

let refreshToken = false
let promiseArray = []
let num = 0

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

    case TOKEN_OVERTIME:
      if (!refreshToken) {
        refreshToken = true
        let res = await checkExpiresIn()
        if (res === 'refresh') {
          promiseArray.forEach((item) => item())
          promiseArray = []
          refreshToken = false
          data = await next.DO(next.url, next.params)
          data.status = data.code === SUCCESS
          return data
        } else {
          refreshToken = false
          if (window.location.href.indexOf('/login') < 0) {
            sessionStorage.clear()
            promiseArray = []
            $router.push('/login')
          }
        }
      } else {
        return new Promise((resolve) => {
          promiseArray.push(() => {
            resolve(next.DO(next.url, next.params))
          })
        })
      }
    // eslint-disable-next-line no-fallthrough
    case TOKEN_ERROR:
      if (window.location.href.indexOf('/login') < 0) {
        sessionStorage.clear()
        refreshToken = false
        promiseArray = []
        $router.push('/login')
      }
    // eslint-disable-next-line no-fallthrough
    case FORCE_OFFLINE:
    case OTHER_PLACE_LOGIN_FORCE_OFFLINE:
      num++
      data.status = true
      if (window.location.href.indexOf('login') < 0 && num == 1) {
        MessageBox.confirm(data.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false,
          showCancelButton: false
        }).then(() => {
          service.postJson('base/system/admin/logout')
          store.dispatch('tags/delAllViews')
          sessionStorage.clear()
          $router.push('/login')
          num = 0
        })
      }
      return data
    default:
      data.status = false
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

const checkExpiresIn = async () => {
  return new Promise((resolve) => {
    if (window.location.href.indexOf('login') > -1 || !utils.getToken()) {
      resolve('error')
      return
    }
    service
      .getU('base/system/token/refreshToken', {
        refreshToken: utils.getRefreshToken(),
        Token: utils.getToken()
      })
      .then(async (res) => {
        if (res.code !== '200') {
          utils.setToken({
            key: 'TOKEN',
            parameter: ''
          })
          resolve('error')
          return
        }
        utils.setToken({
          key: 'uk',
          parameter: res.data.uk
        })
        utils.setToken({
          key: 'TOKEN',
          parameter: res.data.accessToken
        })
        utils.setToken({
          key: 'refreshToken',
          parameter: res.data.refreshToken
        })
        let time2 = Number(res.data.timestamp) + res.data.expiresIn * 1000
        utils.setStorage({
          type: 'localStorage',
          key: 'expiresIn',
          parameter: time2
        })
        await service.setHeader({
          key: 'TOKEN',
          val: res.data.accessToken
        })
        resolve('refresh')
      })
  })
}

export default service
