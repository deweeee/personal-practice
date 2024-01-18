import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import $services from '@/services'
import $storage from '@/utils/storage'
import versionToDo from '@/utils/versionUpdate'
import store from '../store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const beforeEach = (to, from, next) => {
  if (to.name === 'login') {
    versionToDo.isNewVersion()
  }
  NProgress.start()
  $services.setHeader({
    key: 'TOKEN',
    val: $storage.getToken() || ''
  })
  if (to.name !== 'login' && to.name !== 'layout') {
    NProgress.done()
    let re = store.getter['tags/visitedViews'].findIndex((v) => {
      //判定query参数相同则打开同标签页
      if (
        (Object.keys(v.query).length != Object.keys(to.query).length &&
          !Object.keys(v.query).find((el) => el == 'NOCLOSE') &&
          !Object.keys(to.query).find((el) => el == 'NOCLOSE')) ||
        to.name !== v.name
      ) {
        return false
      }
      let t = false
      try {
        t =
          Object.keys(v.query).every(
            (n) => v.query[n] == to.query[n] || n == 'NOCLOSE'
          ) &&
          Object.keys(to.query).every(
            (n) => to.query[n] == v.query[n] || n == 'NOCLOSE'
          )
      } catch (e) {
        console.log(e)
      }
      return t
    })
    if (re >= 0) {
      store.dispatch(
        'tags/setCurrentTag',
        store.getters['tags/visitedViews'][re]
      )
    } else {
      let key = to.name + store.getters['tags/tagIndex']
      store.dispatch(
        'tags/addView',
        Object.assign({}, to, {
          key,
          keyI: store.getters['tags/tagIndex']
        })
      )
      $services
        .postStorage({
          type: 'MULTILANGUAGE',
          url: 'getPageID',
          params: { componentName: to.name }
        })
        .then((res) => {
          if (res.status) {
            // 获取打开组件名的sysPageRefOwid
            if (!res.data) return
            store.dispatch('tags/updateView', { key, id: res.data })
          }
        })
    }
  } else {
    next()
  }
}

const afterEach = () => {
  NProgress.done()
}

export { beforeEach, afterEach }
