import Vue from 'vue'
import VueRouter from 'vue-router'
import constantRouterMap from './path'
import { beforeEach, afterEach } from './interceptor'

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap
})

router.beforeEach(beforeEach)
router.afterEach(afterEach)

//使用$router.push跳转到一个相同的路由,vue会报错,此代码重写了原型的push方法,统一处理了错误信息
//3.1.0版本后已经被官方修复,所以这种做法通常不再必要?
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
