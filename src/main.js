import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '../src/assets/css/global.css'
// 使用按需导入，记得在 babel.config.js 中修改配信息
import { Button, Form, Input, FormItem } from 'element-ui';

Vue.config.productionTip = false;
// 组件注册需要分开写
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
