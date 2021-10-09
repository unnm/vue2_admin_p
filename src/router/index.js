import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注册全局前置导航守卫，用来对token进行校验（根据token获取用户信息）
router.beforeEach((to, from, next) => {
  // to：要去玩的路由
  // from：来哪个路由而来
  // next 是放行函数
  //   next() 无条件放行   next('路径') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
