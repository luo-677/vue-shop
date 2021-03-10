import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/common/main/welcome'
import Users from '../components/common/main/users'
import Rights from '../components/common/main/rights'
import Roles from '../components/common/main/Roles'
import Goods from '../components/common/goods/Goods'
import Params from '../components/common/goods/Params'
import Categories from '../components/common/goods/Categories'

Vue.use(VueRouter)

// 优化时使用路由的懒加载
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },

    ]
  }
]

const router = new VueRouter({
  routes
})

// 三个参数的顺序是固定的
// 使用导航守卫对内容进行权限管理
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
