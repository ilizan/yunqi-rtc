import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'font-awesome/css/font-awesome.min.css'



Vue.use(VueCookies)
Vue.use(VueAxios, axios)//axios

// elementUI
// import 'element-ui/lib/theme-chalk/index.css';
import './element-variables.scss';//自定义样式
import ElementUI from 'element-ui';//全局-需取消配置.babelrc
Vue.use(ElementUI);

Vue.use(Vuex)

// iview
import 'iview/dist/styles/iview.css';
import { Drawer } from 'iview';//单组件-需配置.babelrc
Vue.component('Drawer', Drawer);
// iview end




Vue.config.productionTip = false




var app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
window.vue = app;

router.beforeEach((to, from, next) => {
  let loginData = store.state.loginData;
  next()
  // if (!loginData && to.path == '/seeting') {
  //   // next({ path: '/' })
  // } else {
  //   // next()
  // }
})