import login from '../../views/login'
const Layout = () => import('@/views/layout')

export default [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '客户登录'
    }
  },
  {
    path: '/serviceLogin',
    name: 'serviceLogin',
    component: login,
    meta: {
      title: '客服登录'
    }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      title: '智慧库区管理系统'
    }
  }
]
