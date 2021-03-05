import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../src/assets/css/global.css'
import '../src/assets/font/iconfont.css'
// 使用按需导入，记得在 babel.config.js 中修改配信息
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // 必须返回config对象
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.prototype.$message = Message

Vue.config.productionTip = false
// 组件注册需要分开写
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
